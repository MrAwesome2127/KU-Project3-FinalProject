import type { Task } from './Task';

export interface User {
  username: string | null;
  email: string | null;
  passwordWife: string | null;
  passwordHusband: string | null;
  savedTasks: Task[];
}
