import * as bcrypt from "bcryptjs";
import mongoose, { Document, Model, Types } from "mongoose";

export enum UserRole {
  SUB_ADMIN = "SUB_ADMIN",
  WORKER = "WORKER",
  SUPERVISOR = "SUPERVISOR",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  phonenumber : number;
  role: UserRole;
  assignedLocations: Types.ObjectId[];
  isEmailVerified: boolean;
  pendingEmail?: string;

  // 🔥 NEW
  userCode?: string;        // W001 / S001 / A001
  userCodeNumber?: number;  // 1 / 2 / 3

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      index: true,
      trim: true,
      default: UserRole.SUPERVISOR,
    },

    phonenumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    //(INDEXING SUPPORT)
    userCode: {
      type: String,
      unique: true,
      sparse: true, // allows ADMIN without code
      index: true,
    },

    userCodeNumber: {
      type: Number,
      index: true,
    },

    assignedLocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    pendingEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

/* Hash password */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* Compare password */
userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
