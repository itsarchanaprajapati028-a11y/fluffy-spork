export function Dashboard() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Users', 'Products', 'Orders', 'Categories'].map((x) => (
          <div key={x} className="bg-white rounded-xl border border-gray-100 p-6 text-center font-semibold">{x}</div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;