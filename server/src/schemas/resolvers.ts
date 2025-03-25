import User, { UserDocument } from '../models/user.js';
import { TaskDocument} from '../models/Task.js'
import { signToken } from '../services/auth.js';

import { GraphQLError } from 'graphql';

const AuthenticationError = new GraphQLError('Authentication error');


interface User{
  _id: unknown;
  username: string;
  email: string;
  // passwordWife: string;
  // passwordHusband: string;
  savedTasks: TaskDocument[];
}

//Tasks are not needed when the user is created
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    // password: string;
    passwordWife: string;
    passwordHusband: string;
  }
}

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   stressLevel: string,
//   taskId: string;
//   status: string;
// }

// interface UserArgs {
//   userId: string;
// }

interface Context {
  user?: {
    _id: unknown;
    username: string;
    email: string;
    wife: boolean;
  };
}

interface AddTaskArgs {
  task: TaskDocument;
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
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    //No need to query "tasks", they are already in the 'me' query
  },
  Mutation: {
    addProfile: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id, true);
      return { token, user };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('User not found');
      }

      const isWife = await user.isPasswordWife(password);
      const isHusband = await user.isPasswordHusband(password);

      console.log(isWife)

      console.log(isHusband)

      if(!isWife && !isHusband) {
        throw new GraphQLError('Invalid password');
      }

      let token;

      if (isWife) {
        token = signToken(user.username, user.email, user._id, true);
      } else {
        token = signToken(user.username, user.email, user._id, false);
      }

      return { token, user };
    },
    addTask: async (_parent: any, { task }: AddTaskArgs, context: Context): Promise<User | null> => {
      console.log("Add Task start point " + context.user);
      
      if (context.user) {
        console.log("Signed in?");
        
        if(context.user.wife) {
          console.log("Signed in as wife");
          // const newTask = new Task(task);
          // await newTask.save();
          return await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: { savedTasks: task },
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else {
          throw new GraphQLError('Only the wife can create task');
        }
      }
      throw new GraphQLError('You need to be logged in!');
    },
    // updateTask: async (_parent: any, { task }: UpdateTaskArgs, context: Context): Promise<User | null> => {
    //   if (context.user) {
    //     if(context.user.wife) {
    //       return await User.findOneAndUpdate(
    //         { _id: context.user._id },
    //         { $pull: { tasks: task } },
    //         { new: true }
    //       );
    //     }
    //     else {
    //       return await User.findOneAndUpdate(
    //         { _id: context.user._id },
    //         { $set: { 'tasks.$[elem].status': Task.status } }, // Assuming task has a status field
    //         {
    //           new: true,
    //           arrayFilters: [{ 'elem._id': Task._id }],
    //         }
    //       );
    //     }
    //   }
    //   throw AuthenticationError;
    // },
    // deleteTask: async (_parent: any, { task }: RemoveTaskArgs, context: Context): Promise<User | null> => {
    //   if (context.user) {
    //     if(context.user.wife) {
    //       return await User.findOneAndDelete({ _id: task._id });
    //     } else {
    //       throw new GraphQLError('Only the wife can delete task');
    //     }
    //   }
    //   throw AuthenticationError;
    // },
    // // Maybe not needed - Keeping just in case.
    // // At this time, we do not have a remove profile functionality.
    // removeProfile: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
    //   if (context.user) {
    //     return await User.findOneAndDelete({ _id: context.user._id });
    //   }
    //   throw AuthenticationError;
    // },
  },
};

export default resolvers;