import { Schema, model, type Document} from 'mongoose';
import bcrypt from 'bcrypt';

import taskSchema, { type TaskDocument } from './task.ts';

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedTasks: TaskDocument[];
  // isCorrectPassword(password: string): Promise<boolean>;
  isPasswordHusband(password: string): Promise<boolean>;
  isPasswordWife(password: string): Promise<boolean>;

  bookCount: number;
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
    // passwordWife: {
    //   type: String,
    //   required: true,
    //   minlength: 8,
    // },
    // passwordHusband: {
    //   type: String,
    //   required: true,
    //   minlength: 8,
    // },

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
    this.passwordWife = await bcrypt.hash(this.passwordWife, saltRounds)
    this.passwordHusband = await bcrypt.hash(this.passwordHusband, saltRounds)
  }

  next();
})

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// userSchema.methods.isPasswordHusband = async function (password: string) {
//   return await bcrypt.compare(password, this.passwordHusband);
// };

// userSchema.methods.isPasswordWife = async function (password: string) {
//   return await bcrypt.compare(password, this.passwordWife);
// };

userSchema.virtual('taskCount').get(function() {
  return this.savedTasks.length;
})

const User = model<UserDocument>('User', userSchema);

export default User;
