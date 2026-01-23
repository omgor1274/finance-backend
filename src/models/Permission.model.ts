import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "./User.model";
import { Permission } from "../constants/permissions";

export interface IRolePermission extends Document {
    role: UserRole;
    permissions: Permission[];
}

const rolePermissionSchema = new Schema<IRolePermission>(
    {
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            unique: true,
        },

        permissions: {
            type: [String],
            enum: Object.values(Permission),
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model<IRolePermission>(
    "RolePermission",
    rolePermissionSchema
);