import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.model";

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "gorom626@gmail.com";
    const password = "newuser";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
    }

    await User.create({
      email,
      password,
      isEmailVerified: true
    });

    console.log("Test user created");
    console.log(" Email:", email);
    console.log(" Password:", password);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
