import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function LiveClasses() {
  const [classes, setClasses] = useState([]);
  useEffect(() => { api.get('/instructor/live-classes').then((r) => setClasses(r.data.data || [])).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Classes</h1>
      <div className="space-y-3">
        {classes.map((c) => (
          <div key={c._id} className="bg-white rounded-xl border border-gray-100 p-4">{c.title}</div>
        ))}
      </div>
    </div>
  );
}
export default LiveClasses;