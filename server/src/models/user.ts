import { Schema, model, type Document} from 'mongoose';
import bcrypt from 'bcrypt';

import taskSchema, { type TaskDocument } from './tasks.ts';

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedTasks: TaskDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  taskCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedTasks:  [{
      type: Schema.Types.ObjectId,
      ref: 'Task',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

userSchema.pre('save', async function  (next) {
  if (this.isNew || this.isModified('password')){
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds)
  }

  next();
})

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.virtual('taskCount').get(function() {
  return this.savedTasks.length;
})

const User = model<UserDocument>('User', userSchema);

export default User;
