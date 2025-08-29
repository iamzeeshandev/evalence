import type { TypedUseSelectorHook } from 'react-redux';
import { useStore, useSelector, useDispatch } from 'react-redux';
import type { AppStore, RootState, AppDispatch } from './store';

// Will be use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = useStore.withTypes<AppStore>();
