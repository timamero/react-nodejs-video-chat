/**
 * Socket callbacks for updating Active Users
 */
import { store } from "../../../app/store";
import { getAllActiveUsers } from "../../../app/features/activeUsersSlice";
import { User } from "../../types";

export const setActiveUsers = (users: User[]) => {
  store.dispatch(getAllActiveUsers(users))
}