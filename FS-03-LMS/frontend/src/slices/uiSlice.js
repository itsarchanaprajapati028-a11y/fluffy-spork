import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { modals: {}, notifications: [], toasts: [] },
  reducers: {
    openModal: (state, action) => { state.modals[action.payload] = true; },
    closeModal: (state, action) => { state.modals[action.payload] = false; },
    closeAllModals: (state) => { state.modals = {}; },
  },
});

export const { openModal, closeModal, closeAllModals } = uiSlice.actions;
export default uiSlice.reducer;