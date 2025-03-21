import User, { UserDocument } from '../models/User';
import Tasks, {TaskDocument} from '../models/task'
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

interface AddSkillArgs {
  userId: string;
  skill: string;
}

interface RemoveSkillArgs {
  userId: string;
  skill: string;
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
    addTask: async (_parent: any, { userId, skill }: AddSkillArgs, context: Context): Promise<User | null> => {
      if (context.user) {

        if(context.user.wife) {
          return await User.findOneAndUpdate(
            { _id: userId },
            {
              $addToSet: { skills: skill },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else {
          throw new AuthenticationError('Only the wife can create, modify, or delete tasks');
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
    removeSkill: async (_parent: any, { skill }: RemoveSkillArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { skills: skill } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;