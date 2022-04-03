/**
 * Actions for updating User state
 */
import { store } from '../../../app/store';
import { setNewUser } from '../../../app/features/userSlice';

export const setAppNewUser =(username: string): void => {
  store.dispatch(setNewUser(username));
};