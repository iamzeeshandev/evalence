'use client';

import { appApi } from '@/services/rtk-base-api-service';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

const appReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
});

// Create the Redux store
export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(appApi.middleware), // Add RTK Query middleware
});

// Define RootState and AppDispatch types
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
