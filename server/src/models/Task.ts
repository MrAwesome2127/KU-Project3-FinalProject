import { Schema, Document } from 'mongoose';

export interface TaskDocument extends Document {
  title: string;
  description: string;
  stressLevel: string;
  dueDate: Date;
}

const taskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stressLevel: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  }
});

// const Task = model<TaskDocument>('Thought', taskSchema);


export default taskSchema;
