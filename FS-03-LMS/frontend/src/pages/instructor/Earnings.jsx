import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function Earnings() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/instructor/earnings').then((r) => setData(r.data.data)).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
      <p className="text-gray-500">Balance: ${data?.balance ?? 0}</p>
    </div>
  );
}
export default Earnings;