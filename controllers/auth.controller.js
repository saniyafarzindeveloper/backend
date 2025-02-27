import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession(); //this is a session for mongoose transaction
  session.startTransaction(); //performs atomic operations.
  //atomic operations - DB operations that update the state are atomic. they either perform complete operation or don't get executed at all.

  try {
    //try inserting a new user i.e CREATE NEW USER
    //req.body is an object containing data from the client

    const { name, email, password } = req.body;

    //check if a user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    //if no existingUser --> hash the pw
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    //once pw is hashed successfully, new user can be created
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();

    session.endSession();

    //return
    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    //if an error occurs abort & end the session
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //if no user is found
    if (!user) {
      const error = new Error("User not found :(");
      error.statusCode = 404;
      throw error;
    }

    //if user is found --> match passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //if password is not valid
    if (!isPasswordValid) {
      const error = new Error("Invalid password!");
      error.statusCode = 401;
      throw error;
    }

    //but if the password is valid
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(201).json({
      success: true,
      message: "User signed in successfully!",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {};
