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

    const email = "gorom@gmail.com";
    const password = "newuser1";
    const phonenumber = 9925371223;
    const role = UserRole.SUPERVISOR;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
    }

    // 🔥 GENERATE ROLE-BASED CODE
    const codeData = await generateUserCode(role);

    const user = await User.create({
      email,
      password,
      phonenumber,
      role,
      isEmailVerified: true,
      ...codeData,
    });

    console.log("Test user created");
    console.log(" Email:", email);
    console.log(" Role:", role);
    console.log(" Code:", user.userCode);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
