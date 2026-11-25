import { createSlice } from '@reduxjs/toolkit';

const liveClassSlice = createSlice({
  name: 'liveClass',
  initialState: { liveClasses: [], currentLiveClass: null },
  reducers: {
    setLiveClasses: (state, action) => { state.liveClasses = action.payload; },
  },
});

export const { setLiveClasses } = liveClassSlice.actions;
export default liveClassSlice.reducer;