import { useEffect, useState } from 'react';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard';

export function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { api.get('/admin/courses').then((r) => setCourses(r.data.data || [])).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Courses</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {courses.map((c) => <ProductCard key={c._id} product={c} />)}
      </div>
    </div>
  );
}
export default Courses;