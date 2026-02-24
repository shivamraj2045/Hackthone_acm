export type UserRole = 'user' | 'admin';

export type QueueStatus = 'pending' | 'approved' | 'serving' | 'served' | 'skipped' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface QueueItem {
  id: string;
  userId: string;
  userName: string;
  tokenNumber: number | null;
  status: QueueStatus;
  position: number | null;
  createdAt: string;
  servedAt?: string;
}

export interface QueueState {
  items: QueueItem[];
  currentServingToken: number | null;
  lastTokenNumber: number;
}