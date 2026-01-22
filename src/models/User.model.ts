import * as bcrypt from "bcryptjs";
import mongoose, { Document, Model, Types } from "mongoose";

export enum UserRole {
  SUB_ADMIN = "SUB_ADMIN",
  WORKER = "WORKER",
  SUPERVISOR = "SUPERVISOR",
  ADMIN = "ADMIN",
}

export enum SalaryType {
  MONTHLY = "MONTHLY",
  DAILY = "DAILY",
}

export enum BloodGroup {
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  O_POS = "O+",
  O_NEG = "O-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
}


export interface IUser extends Document {
  _id: Types.ObjectId;

  // Auth
  email: string;
  password: string;
  isEmailVerified?: boolean;
  pendingEmail?: string;

  // Profile (from UI)
  firstName: string;
  lastName: string;
  phonenumber: string;
  address: string;
  bloodGroup?: BloodGroup;
  dateOfBirth?: Date;
  profileImage?: string;

  // Salary
  salary: number;
  salaryType?: SalaryType;

  // Role & hierarchy
  role: UserRole;
  assignedLocations?: Types.ObjectId[];

  // Indexing
  userCode?: string;
  userCodeNumber?: number;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    /* ================= AUTH ================= */
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    pendingEmail: {
      type: String,
    },

    /* ================= PROFILE ================= */
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    phonenumber: {
      type: String, 
      required: true,
      unique: true,
      index: true,
    },

    address: {
      type: String,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: Object.values(BloodGroup),
    },

    dateOfBirth: {
      type: Date,
    },

    profileImage: {
      type: String,
    },

    /* ================= SALARY ================= */
    salary: {
      type: Number,
      required: true,
    },

    salaryType: {
      type: String,
      enum: Object.values(SalaryType),
      default: SalaryType.MONTHLY,
    },

    /* ================= ROLE ================= */
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.WORKER,
      index: true,
    },

    assignedLocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],

    /* ================= INDEXING ================= */
    userCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    userCodeNumber: {
      type: Number,
      index: true,
    },
  },
  { timestamps: true }
);

/* ================= PASSWORD HASH ================= */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ================= PASSWORD COMPARE ================= */
userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
