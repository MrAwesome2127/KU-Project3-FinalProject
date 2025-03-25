import { Task, User } from '../models/index.js';
import process from 'process';

const cleanDB = async (): Promise<void> => {
  try {
    // await Task.deleteMany({});
    await User.deleteMany({});
    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
}

export default cleanDB;