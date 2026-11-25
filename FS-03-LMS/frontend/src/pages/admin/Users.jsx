import { useEffect, useState } from 'react';
import api from '../../utils/api';

export function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/admin/users').then((r) => setUsers(r.data.data || [])).catch(() => {}); }, []);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl border border-gray-100 divide-y">
        {users.map((u) => (
          <div key={u._id} className="p-4 flex justify-between">
            <span>{u.firstName} {u.lastName}</span>
            <span className="text-gray-500">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Users;