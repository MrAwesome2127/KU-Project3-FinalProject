import User, { UserDocument } from '../models/User';
import Tasks, {TaskDocument} from '../models/task'
import { signToken } from '../services/auth';

// interface Profile {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   skills: string[];
// }

// interface AddSkillArgs {
//   profileId: string;
//   skill: string;
// }

// interface RemoveSkillArgs {
//   profileId: string;
//   skill: string;
// }

interface User{
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
      const token = signToken(user.username, user.email, user._id, );
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const isPasswordHusband = await user.isPasswordHusband(password);
      const isPasswordWife = await user.isPasswordWife(password);

      if (!isPasswordHusband && !isPasswordWife) {
        throw AuthenticationError;
      }

      const token = signToken(profile.name, profile.email, profile._id, isPasswordWife);
      return { token, profile };
    },
    addTask: async (_parent: any, { profileId, skill }: AddSkillArgs, context: Context): Promise<Profile | null> => {
      if (context.user) {

        if(context.user.wife) {
          return await Profile.findOneAndUpdate(
            { _id: profileId },
            {
              $addToSet: { skills: skill },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else {

        }
        
      }
      throw AuthenticationError;
    },
    removeProfile: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    removeSkill: async (_parent: any, { skill }: RemoveSkillArgs, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
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