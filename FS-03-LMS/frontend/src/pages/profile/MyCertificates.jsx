import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function MyCertificates() {
  const [certs, setCerts] = useState([]);
  useEffect(() => {
    api.get('/certificates/my-certificates').then((r) => setCerts(r.data.data || [])).catch(() => {});
  }, []);
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Certificates</h1>
      <div className="space-y-3">
        {certs.map((c) => (
          <div key={c._id} className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{c.course?.title}</h3>
              <p className="text-sm text-gray-500">{c.certificateId}</p>
            </div>
            <a href={`/api/certificates/${c._id}/download`} className="text-primary-600 text-sm">Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MyCertificates;