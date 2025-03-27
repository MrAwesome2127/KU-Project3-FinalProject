export interface TaskDocument {
  // _id: string;
  title: string;
  description: string;
  stressLevel: string,
  dueDate: string;
  statusTask: 'new' | 'inProgress' | 'completed'; 
}
