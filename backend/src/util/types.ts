/**
 * This file contains TypeScript interfaces for the Room and
 * User entities used in the application. These interfaces
 * define the structure of the data objects that represent
 * rooms and users.
 */
export interface Room {
  id: string;
  users: string;
}

export interface User {
  id: string;
  socketId: string;
  username: string;
  isBusy: string;
  [key: string]: any; // To allow other dynamic fields
}
