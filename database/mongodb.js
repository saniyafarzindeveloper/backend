import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Pls define the MONGODB_URI inside .env<development/production.local>"
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`connected to DB in ${NODE_ENV} mode`)
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  }
};

export default connectToDatabase;
