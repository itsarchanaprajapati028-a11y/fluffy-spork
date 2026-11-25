import { Link } from 'react-router-dom';

export function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <Link to="/courses" onClick={onClose}>Courses</Link>
        <Link to="/my-courses" onClick={onClose}>My Courses</Link>
        <Link to="/login" onClick={onClose}>Login</Link>
      </div>
    </div>
  );
}

export default MobileMenu;