import db from '../config/connection.js';
import { User } from '../models/index.js';
import cleanDB from './cleanDB';

import userData from './userData.json' with { type: 'json'};

const seedDatabase = async (): Promise<void> => {
  try{
    await db;
    await cleanDB();

    await User.insertMany(userData);
    console.log("Seeding complete.")
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB", err);
    process.exit(1)
  }
}

seedDatabase();