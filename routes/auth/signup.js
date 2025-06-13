import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import Student from "../../models/Student.js";
import Instructor from "../../models/Instructor.js";
import Admin from "../../models/Admin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser =
      (await Student.findOne({ email })) ||
      (await Admin.findOne({ email })) ||
      (await Instructor.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please provide a different email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "Student") {
      newUser = new Student({ name, email, password: hashedPassword });
    } else if (role === "Instructor") {
      newUser = new Instructor({ name, email, password: hashedPassword });
    } else if (role === "Admin") {
      newUser = new Admin({ name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    await newUser.save();

    res.status(201).json({
      message: "User has been successfully created",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Signing Up, Internal Server Error" });
  }
});

export default router;
