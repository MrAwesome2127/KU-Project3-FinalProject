import { TaskDocument } from "../models/TaskDocument";


export interface User {
  username: string | null;
  email: string | null;
  passwordWife: string | null;
  passwordHusband: string | null;
  savedTasks: TaskDocument[];
}
