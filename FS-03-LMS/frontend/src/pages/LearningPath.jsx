import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export function LearningPath() {
  const { courseId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  useEffect(() => {
    api.get(`/enrollments/${courseId}`).then((r) => { setEnrollment(r.data.data); setCourse(r.data.data.course); }).catch(() => {});
  }, [courseId]);
  const lessons = course ? course.modules.flatMap((m) => m.lessons) : [];
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{course?.title || 'Course'}</h1>
      <p className="text-gray-500 mb-6">Progress: {enrollment?.progress || 0}%</p>
      <div className="space-y-2">
        {lessons.map((l) => (
          <Link key={l._id} to={`/courses/${courseId}/lesson/${l._id}`} className="block bg-white rounded-lg border border-gray-100 p-4 hover:shadow">
            {l.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
export default LearningPath;