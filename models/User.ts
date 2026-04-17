import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
    },
    { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;