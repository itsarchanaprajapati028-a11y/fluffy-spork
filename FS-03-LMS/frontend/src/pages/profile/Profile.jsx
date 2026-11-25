import { useAuth } from '../../hooks/useAuth';

export function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
        <div><span className="text-gray-500">Name:</span> {user?.firstName} {user?.lastName}</div>
        <div><span className="text-gray-500">Email:</span> {user?.email}</div>
        <div><span className="text-gray-500">Role:</span> {user?.role}</div>
      </div>
    </div>
  );
}
export default Profile;