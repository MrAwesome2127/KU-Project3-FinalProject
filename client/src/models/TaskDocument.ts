export interface TaskDocument {
  _id: string;
  title: string;
  description: string;
  stressLevel: string,
  dueDate: Date;
  status: 'new' | 'inProgress' | 'completed'; 
}
