import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Modal from './Modal';

interface ModalManagerProps {
  modals: Record<string, boolean | object | null>;
}

export default function ModalManager({ modals }: ModalManagerProps) {
  const activeModals = Object.entries(modals).filter(([, value]) => value !== false && value !== null);
  
  if (activeModals.length === 0) return null;
  
  return createPortal(
    <>
      {activeModals.map(([modalName, modalData]) => {
        const isObject = typeof modalData === 'object' && modalData !== null;
        return (
          <Modal
            key={modalName}
            isOpen={true}
            onClose={() => {}}
            title={isObject && 'title' in modalData ? (modalData as any).title : undefined}
          >
            {isObject && 'children' in modalData ? (modalData as any).children : null}
          </Modal>
        );
      })}
    </>,
    document.body
  );
}