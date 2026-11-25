import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'course',
  initialState: { courses: [], currentCourse: null, featuredCourses: [], categories: [], brands: [] },
  reducers: {
    setCourses: (state, action) => { state.courses = action.payload; },
    setCurrentCourse: (state, action) => { state.currentCourse = action.payload; },
  },
});

export const { setCourses, setCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;