import mongoose from "mongoose";
import User from "./User.js";

const adminSchema = new mongoose.Schema({
  managedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Admin = User.discriminator("Admin", adminSchema);

export default Admin;
