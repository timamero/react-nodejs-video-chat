import { type Dispatch } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { type RootState, type AppDispatch } from './store';

// Use throughout app instead of `useDispatch` and `useSelector`
export const useAppDispatch = (): Dispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
