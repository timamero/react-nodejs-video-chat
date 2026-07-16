import { ObjectId } from 'mongodb';

export interface Room {
  _id: ObjectId;
  users: User[];
}

export interface User {
  id: string;
  socketId: string;
  username: string;
  isBusy: string;
  [key: string]: any; // To allow other dynamic fields
}
// export interface User {
//   _id: ObjectId;
//   username: string;
//   socketId: string;
// }
