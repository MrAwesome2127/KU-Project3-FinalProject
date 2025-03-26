import { Schema, Document } from 'mongoose';

export interface TaskDocument extends Document {
  title: string;
  description: string;
  stressLevel: string;
  dueDate: Date;
  statusTask: string;
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
  },
  statusTask: {
    type: String,
    enum: ['new', 'inProgress', 'completed'],
    default: 'new',
  }
});

// const Task = model<TaskDocument>('Thought', taskSchema);


export default taskSchema;
