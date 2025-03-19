import type { Task } from './Task';

export interface User {
  username: string | null;
  email: string | null;
  password: string | null;
  savedTasks: Task[];
}
