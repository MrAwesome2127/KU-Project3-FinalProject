import db from '../config/connection.ts';
import { Task, User } from '../models/index.ts';
import cleanDB from './cleanDB';

import userData from './userData.json' with { type: 'json'};
import taskData from './taskData.json' with { type: 'json' };
import mongoose from 'mongoose';

const seedDatabase = async (): Promise<void> => {
  try{
    await db;
    await cleanDB();

    await Task.insertMany(taskData);
    await User.insertMany(userData);
    console.log("Seeding complete.")
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB", err);
    process.exit(1)
  }
}