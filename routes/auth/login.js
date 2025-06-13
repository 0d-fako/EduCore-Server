import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../../models/Student.js";
import Instructor from "../../models/Instructor.js";
import Admin from "../../models/Admin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req?.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user =
      (await Student.findOne({ email })) ||
      (await Instructor.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

export default router;
