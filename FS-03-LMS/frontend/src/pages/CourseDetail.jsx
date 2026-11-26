import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/helpers';
import api from '../utils/api';
import {
  StarIcon, ClockIcon, UserGroupIcon, PlayIcon, CheckCircleIcon,
  ArrowRightIcon, LockClosedIcon, AcademicCapIcon, SignalIcon,
} from '@heroicons/react/24/outline';

export function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    fetchCourseBySlug, fetchRelated, currentCourse, relatedProducts,
    isLoading, error, clearCurrentCourse,
  } = useCourses();
  const { isAuthenticated } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  useEffect(() => {
    if (slug) fetchCourseBySlug(slug);
    return () => clearCurrentCourse();
  }, [slug, fetchCourseBySlug, clearCurrentCourse]);

  useEffect(() => {
    if (currentCourse?.category) {
      fetchRelated(currentCourse._id, currentCourse.category, 4);
    }
  }, [currentCourse, fetchRelated]);

  if (isLoading && !currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "The course you're looking for doesn't exist or has been removed."}</p>
          <Link to="/courses" className="btn-primary inline-block">Continue Browsing</Link>
        </div>
      </div>
    );
  }

  const course = currentCourse;
  const image = course.thumbnail?.url || course.images?.[0]?.url || '/placeholder-course.svg';
  const instructor = course.instructor;
  const instructorName = instructor ? `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() : '';
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const lessons = (course.modules || []).flatMap((m) => m.lessons || []);
  const totalLessons = course.lessonsCount || lessons.length;
  const rating = Number(course.rating) || 0;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsEnrolling(true);
    setEnrollError(null);
    try {
      await api.post('/enrollments', { courseId: course._id });
      navigate(`/learning/${course._id}`);
    } catch (e) {
      setEnrollError(e.response?.data?.message || 'Could not enroll in this course. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="mb-6 text-sm text-white/70" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/courses" className="hover:text-white">Courses</Link>
            {course.category && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/courses?category=${encodeURIComponent(course.category)}`} className="hover:text-white">{course.category}</Link>
              </>
            )}
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {course.isFeatured && (
                <span className="inline-block mb-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">Featured</span>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
              {course.shortDescription && (
                <p className="text-lg text-white/90 mb-4">{course.shortDescription}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <strong>{rating.toFixed(1)}</strong>
                  <span className="text-white/70">({course.reviewCount || 0} reviews)</span>
                </span>
                <span className="flex items-center gap-1">
                  <UserGroupIcon className="h-5 w-5" />
                  {course.students || 0} students
                </span>
                <span className="flex items-center gap-1">
                  <SignalIcon className="h-5 w-5" />
                  <span className="capitalize">{course.level || 'beginner'}</span>
                </span>
                {course.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-5 w-5" />
                    {course.duration} min
                  </span>
                )}
              </div>

              {instructorName && (
                <p className="mt-4 text-white/80">
                  Created by <span className="font-semibold text-white">{instructorName}</span>
                </p>
              )}
            </div>

            <div className="lg:row-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:sticky lg:top-24">
                <img src={image} alt={course.thumbnail?.alt || course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {course.price > 0 ? formatPrice(course.price) : 'Free'}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(course.originalPrice)}</span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-sm text-green-600 mt-1">
                      Save {formatPrice(course.originalPrice - course.price)}
                    </p>
                  )}

                  {enrollError && (
                    <p className="mt-4 text-sm text-red-600" role="alert">{enrollError}</p>
                  )}

                  <Button size="lg" className="w-full mt-6" onClick={handleEnroll} disabled={isEnrolling}>
                    {isEnrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Enrolling...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Enroll Now <ArrowRightIcon className="h-5 w-5" />
                      </span>
                    )}
                  </Button>

                  <ul className="mt-6 space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><PlayIcon className="h-4 w-4 text-primary-600" /> {totalLessons} lessons</li>
                    <li className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-primary-600" /> Lifetime access</li>
                    <li className="flex items-center gap-2"><AcademicCapIcon className="h-4 w-4 text-primary-600" /> Certificate of completion</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-primary-600" /> Learn at your own pace</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {course.description && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About this course</h2>
                <div className="text-gray-600 whitespace-pre-wrap">{course.description}</div>
              </section>
            )}

            {course.attributes && Object.keys(course.attributes).length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(course.attributes).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="text-sm text-gray-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course content</h2>
              {lessons.length === 0 ? (
                <p className="text-gray-500">Course content will be available soon.</p>
              ) : (
                <div className="space-y-4">
                  {(course.modules || []).map((module, moduleIndex) => (
                    <div key={module._id || moduleIndex} className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900">
                        {module.title}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({(module.lessons || []).length} lessons)
                        </span>
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {(module.lessons || []).map((lesson) => (
                          <li key={lesson._id} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700">
                            {lesson.isPreview ? (
                              <PlayIcon className="h-4 w-4 text-primary-600" />
                            ) : (
                              <LockClosedIcon className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="flex-1">{lesson.title}</span>
                            {lesson.duration > 0 && <span className="text-gray-400">{lesson.duration} min</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
              {course.category && (
                <Link to={`/courses?category=${encodeURIComponent(course.category)}`} className="text-primary-600 hover:text-primary-700 font-medium">
                  View All <ArrowRightIcon className="h-4 w-4 inline ml-1" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedCourse) => (
                <ProductCard key={relatedCourse._id} product={relatedCourse} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Sign In to Continue"
      >
        <p className="text-gray-600 mb-4">Please sign in to enroll in this course.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => { setShowLoginModal(false); navigate('/register'); }}>
            Create Account
          </Button>
          <Button className="flex-1" onClick={() => { setShowLoginModal(false); navigate('/login'); }}>
            Sign In
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default CourseDetail;
