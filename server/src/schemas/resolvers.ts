import User, { UserDocument } from '../models/user.js';
import { TaskDocument} from '../models/Task.js'
import { signToken } from '../services/auth.js';

import { GraphQLError } from 'graphql';
import e from 'express';

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
    id: unknown;
    username: string;
    email: string;
    wife: boolean;
  };
}

interface TaskArgs {
  task: TaskDocument;
}

interface UpdateTaskArgs {
  task: TaskDocument;
  taskId: string;
}

interface deleteTaskArgs {
  task: TaskDocument;
  taskId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user.id });
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
    addTask: async (_parent: any, { task }: TaskArgs, context: Context): Promise<User | null> => {
      console.log("Add Task start point " + context.user);
      
      if (context.user) {
        console.log("Signed in?");
        
        if(context.user.wife) {
          console.log("Signed in as wife");
          // const newTask = new Task(task);
          // await newTask.save();
          const target = await User.findOneAndUpdate(
            { _id: context.user.id },
            {
              $addToSet: { savedTasks: task },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          console.log("Task added to user " + target);
          return target;
        } else {
          throw new GraphQLError('Only the wife can create task');
        }
      }
      throw new GraphQLError('You need to be logged in!');
    },
    updateTask: async (_parent: any, { task, taskId }: UpdateTaskArgs, context: Context): Promise<User | null> => {
      if (context.user) {

        const targetUser = await User.findById(
          context.user.id 
        );

        if (!targetUser) {
          throw new GraphQLError('User not found');
        }

        const updateTaskIndex = targetUser?.savedTasks.findIndex((task: TaskDocument) => task.id.toString() === taskId);
        if (updateTaskIndex === -1) {
          throw new GraphQLError('Task not found');
        }

        if(context.user.wife) {
          targetUser.savedTasks[updateTaskIndex].title = task.title;
          targetUser.savedTasks[updateTaskIndex].description = task.description;
          targetUser.savedTasks[updateTaskIndex].stressLevel = task.stressLevel;
          targetUser.savedTasks[updateTaskIndex].dueDate = task.dueDate;
        } else if (!task.statusTask) {
          throw new GraphQLError('Only the wife can update the task status');
        }

        if(!context.user.wife) {
          targetUser.savedTasks[updateTaskIndex].statusTask = task.statusTask;
        } else {
          // throw new GraphQLError('Only the husband can update task status');
          targetUser.savedTasks[updateTaskIndex].statusTask = "new";

        }
        
        await targetUser.save()
          
        return targetUser;
      }
      throw AuthenticationError;
    },
    deleteTask: async (_parent: any, { taskId }: deleteTaskArgs, context: Context): Promise<User | null> => {
      if (context.user) {

        const targetUser = await User.findById(
          context.user.id 
        );

        if (!targetUser) {
          throw new GraphQLError('User not found');
        }

        const deleteTaskIndex = targetUser?.savedTasks.findIndex((task: TaskDocument) => task.id.toString() === taskId);
        if (deleteTaskIndex === -1) {
          throw new GraphQLError('Task not found');
        }

        if(context.user.wife) {
          const filteredTasks = targetUser.savedTasks.filter((task: TaskDocument) => task.id.toString() !== taskId);
          targetUser.savedTasks = filteredTasks;
        } else {
          throw new GraphQLError('Only the wife can delete a task');
        }
        await targetUser.save()
        return targetUser;
      }
      throw AuthenticationError;
    }
  },
};

export default resolvers;