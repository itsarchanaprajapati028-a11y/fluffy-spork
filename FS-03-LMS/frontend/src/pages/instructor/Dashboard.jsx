import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/instructor/dashboard').then((r) => setStats(r.data.data)).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Instructor Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">Courses: {stats?.stats?.courses ?? 0}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">Students: {stats?.stats?.students ?? 0}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">Earnings: ${stats?.stats?.earnings ?? 0}</div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">Live: {stats?.stats?.liveClasses ?? 0}</div>
      </div>
    </div>
  );
}
export default Dashboard;