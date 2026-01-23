import * as dotenv from "dotenv";
import mongoose from "mongoose";
import User, { UserRole } from "../models/User.model";
import { generateUserCode } from "../utils/generateUserCode";

dotenv.config();

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "gorom123@gmail.com";
    // const password = "admin";
    // const phonenumber = 9925371223;
    const role = UserRole.WORKER;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
    }

    const codeData = await generateUserCode(role);

    await User.create({
      firstName: "worker",
      lastName: "worker",
      email: "gorom123@gmail.com",
      password: "sup",
      phonenumber: 9925371221,
      salary: 0,
      role: UserRole.WORKER,
      isEmailVerified: true,
    });

    console.log("Test user created");
    console.log(" Email:", email);
    console.log(" Role:", role);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
