import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function Instructors() {
  const [instructors, setInstructors] = useState([]);
  useEffect(() => { api.get('/admin/instructors').then((r) => setInstructors(r.data.data || [])).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Instructors</h1>
      <div className="bg-white rounded-xl border border-gray-100 divide-y">
        {instructors.map((i) => (
          <div key={i._id} className="p-4">{i.firstName} {i.lastName}</div>
        ))}
      </div>
    </div>
  );
}
export default Instructors;