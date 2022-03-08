/**
 * User actions
 */
import { store } from "../../../app/store";
import { setNewUser } from "../../../app/features/userSlice";

export const setAppNewUser =(username: string) => {
  store.dispatch(setNewUser(username))
}