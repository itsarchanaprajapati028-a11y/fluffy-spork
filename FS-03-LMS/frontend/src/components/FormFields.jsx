export function Input({ label, error, helperText, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" {...props} />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}

export function Textarea({ label, error, helperText, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" {...props} />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}

export function Select({ label, error, helperText, options = [], placeholder, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}

export default { Input, Textarea, Select };