import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) {
  if (!isOpen) return null;
  const sizes = { md: 'max-w-lg', lg: 'max-w-2xl', full: 'max-w-5xl' };
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl w-full ${sizes[size] || sizes.md} max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {showCloseButton && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;