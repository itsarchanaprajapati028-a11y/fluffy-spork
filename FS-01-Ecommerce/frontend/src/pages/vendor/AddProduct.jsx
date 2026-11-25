import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

export function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', brand: '', stock: '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      navigate('/vendor/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{id ? 'Edit' : 'Add'} Product</h1>
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <input required placeholder="Name" value={form.name} onChange={set('name')} className="w-full border rounded px-3 py-2" />
        <textarea placeholder="Description" value={form.description} onChange={set('description')} className="w-full border rounded px-3 py-2" />
        <input required type="number" placeholder="Price" value={form.price} onChange={set('price')} className="w-full border rounded px-3 py-2" />
        <input placeholder="Category" value={form.category} onChange={set('category')} className="w-full border rounded px-3 py-2" />
        <input placeholder="Brand" value={form.brand} onChange={set('brand')} className="w-full border rounded px-3 py-2" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={set('stock')} className="w-full border rounded px-3 py-2" />
        <button disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg">{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

export default AddProduct;