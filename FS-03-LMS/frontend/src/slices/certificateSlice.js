import { createSlice } from '@reduxjs/toolkit';

const certificateSlice = createSlice({
  name: 'certificate',
  initialState: { certificates: [] },
  reducers: {
    setCertificates: (state, action) => { state.certificates = action.payload; },
  },
});

export const { setCertificates } = certificateSlice.actions;
export default certificateSlice.reducer;