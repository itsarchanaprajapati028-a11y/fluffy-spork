import { useState, useCallback } from 'react';

export function useUI() {
  const [modals, setModals] = useState({});
  const openModal = useCallback((name) => setModals((m) => ({ ...m, [name]: true })), []);
  const closeModal = useCallback((name) => setModals((m) => ({ ...m, [name]: false })), []);
  const closeAllModals = useCallback(() => setModals({}), []);
  return { modals, openModal, closeModal, closeAllModals };
}

export default useUI;