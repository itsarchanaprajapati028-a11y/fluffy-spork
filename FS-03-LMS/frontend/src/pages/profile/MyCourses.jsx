import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  useEffect(() => {
    api.get('/enrollments/my-courses').then((r) => setEnrollments(r.data.data || [])).catch(() => {});
  }, []);
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {enrollments.map((e) => (
          <Link key={e._id} to={`/learning/${e.course?._id}`} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow">
            <h3 className="font-semibold">{e.course?.title}</h3>
            <div className="text-sm text-gray-500 mt-1">Progress: {e.progress}%</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default MyCourses;