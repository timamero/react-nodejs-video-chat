import { ObjectId } from "mongodb";

export interface Room {
  _id: ObjectId;
  users: User[];
}

export interface User {
  _id: ObjectId;
  username: string;
  socketId: string;
}