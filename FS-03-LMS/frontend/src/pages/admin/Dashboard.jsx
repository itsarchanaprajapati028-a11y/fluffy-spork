import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then((r) => setStats(r.data.data)).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">Users: {stats?.stats?.users ?? 0}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">Courses: {stats?.stats?.courses ?? 0}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">Instructors: {stats?.stats?.instructors ?? 0}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">Revenue: ${stats?.stats?.revenue ?? 0}</div>
      </div>
    </div>
  );
}
export default Dashboard;