import { createSlice } from '@reduxjs/toolkit';

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: { enrollments: [], currentEnrollment: null },
  reducers: {
    setEnrollments: (state, action) => { state.enrollments = action.payload; },
  },
});

export const { setEnrollments } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;