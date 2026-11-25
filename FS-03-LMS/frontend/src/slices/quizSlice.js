import { createSlice } from '@reduxjs/toolkit';

const quizSlice = createSlice({
  name: 'quiz',
  initialState: { currentQuiz: null, result: null },
  reducers: {
    setCurrentQuiz: (state, action) => { state.currentQuiz = action.payload; },
    setResult: (state, action) => { state.result = action.payload; },
  },
});

export const { setCurrentQuiz, setResult } = quizSlice.actions;
export default quizSlice.reducer;