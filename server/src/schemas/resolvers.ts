import User, { UserDocument } from '../models/User';
import Task, {TaskDocument} from '../models/Task'
import { signToken } from '../services/auth';

interface User{
  _id: string;
  username: string;
  email: string;
  password: string;
  // passwordWife: string;
  // passwordHusband: string;
  wife: boolean;
  savedTasks: Task[];
}

//Tasks are not needed when the user is created
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface Task {
  _id: string;
  title: string;
  description: string;
  stressLevel: string,
  taskId: string;
}

interface UserArgs {
  userId: string;
}

interface Context {
  user?: User;
}

interface AddTaskArgs {
  userId: string;
  task: string;
}

interface UpdateTaskArgs {
  userId: string;
  task: string;
}

interface RemoveTaskArgs {
  userId: string;
  task: string;
}

const resolvers = {
  Query: {
    profiles: async (): Promise<User[]> => {
      return await User.find();
    },
    profile: async (_parent: any, { userId }: UserArgs): Promise<User | null> => {
      return await User.findOne({ _id: userId });
    },
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addProfile: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id, user.wife);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const isPasswordValid = await user.Password(password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid password');
      }

      const token = signToken(user.name, user.email, user._id, user.password);
      return { token, user };
    },
    addTask: async (_parent: any, { userId, task }: AddTaskArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        if(context.user.wife) {
          return await User.findOneAndCreate(
            { _id: userId },
            {
              $addToSet: { tasks: task },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else {
          throw new AuthenticationError('Only the wife can create task');
        }
        
      }
      throw AuthenticationError;
    },
    updateTask: async (_parent: any, { task }: UpdateTaskArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        if(context.user.wife) {
          return await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { tasks: task } },
            { new: true }
          );
        }
        else {
          return await User.findOneAndUpdate(
            { _id: context.user._id },
            { $set: { 'tasks.$[elem].status': task.status } }, // Assuming task has a status field
            {
              new: true,
              arrayFilters: [{ 'elem._id': task._id }],
            }
          );
        }
      }
      throw AuthenticationError;
    },
    deleteTask: async (_parent: any, { task }: RemoveTaskArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        if(context.user.wife) {
          return await User.findOneAndDelete({ _id: task._id });
        } else {
          throw new AuthenticationError('Only the wife can delete task');
        }
      }
      throw AuthenticationError;
    },
    // Maybe not needed - Keeping just in case.
    // At this time, we do not have a remove profile functionality.
    removeProfile: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;