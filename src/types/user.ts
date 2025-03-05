import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserInput {
  name: string;
  email: string;
}
