import { Schema, model, type Document } from 'mongoose';

export interface TaskDocument extends Document {
  taskId: string;
  title: string;
  description: string;
  stressLevel: string;
}

const taskSchema = new Schema<TaskDocument>({
  description: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    required: true,
  },
  stressLevel: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
});

// const Task = model<TaskDocument>('Thought', taskSchema);


export default taskSchema;
