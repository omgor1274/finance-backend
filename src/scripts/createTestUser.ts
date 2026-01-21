import * as dotenv from "dotenv";
import User, { UserRole } from "../models/User.model";

dotenv.config();

import mongoose from "mongoose";

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "gorom627@gmail.com";
    const password = "newuser1";
    const role = UserRole.SUPERVISOR;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
    }

    await User.create({
      email,
      password,
      role,
      isEmailVerified: true
    });

    console.log("Test user created");
    console.log(" Email:", email);
    console.log(" Password:", password);
    console.log(" Role:", role);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
