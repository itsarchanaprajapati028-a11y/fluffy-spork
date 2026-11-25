import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import courseReducer from '../slices/courseSlice';
import enrollmentReducer from '../slices/enrollmentSlice';
import quizReducer from '../slices/quizSlice';
import liveClassReducer from '../slices/liveClassSlice';
import certificateReducer from '../slices/certificateSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    enrollment: enrollmentReducer,
    quiz: quizReducer,
    liveClass: liveClassReducer,
    certificate: certificateReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */
