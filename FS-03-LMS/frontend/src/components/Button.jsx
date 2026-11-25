export function Button({ children, variant = 'primary', className = '', asChild, ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-colors';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  if (asChild && children && children.type) {
    return children;
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;