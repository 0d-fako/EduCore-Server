import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcrypt";
import Instructor from "../models/Instructor.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

const validateInstructor = (req, res, next) => {
  if (req.user?.role !== "Instructor") {
    return res
      .status(403)
      .json({ message: "Access denied, Only instructor can create course" });
  }
  next();
};

router.post("/createCourse", validateInstructor, async (req, res) => {
  try {
    const { courseCode, courseTitle, courseDescription, instructorId } =
      req?.body;

    if (!courseCode || !instructorId || !courseTitle) {
      return res.status(400).json({
        message: "Course code, course title, instructor are required",
      });
    }

    let existingCourse = await Course.findOne({ courseCode });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course code already exist",
      });
    }

    let instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({ message: "Unable to find the instructor" });
    }

    const newCourse = new Course({
      courseCode,
      courseTitle,
      courseDescription,
      instructor: instructorId,
    });

    instructor.coursesTaught.push(newCourse._id);

    await newCourse.save();
    await instructor.save();

    return res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error({ message: error });
    return res.status(500).json({ message: "Error creating course" });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .select("courseCode courseTitle")
      .populate("instructor", "name");

    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to get all courses" });
  }
});

router.get("/instructor/:id", async (req, res) => {
  try {
    const instructorId = req.params.id;

    const existingInstructor = await Instructor.findById(instructorId);
    if (!existingInstructor) {
      return res
        .status(404)
        .json({ message: "Instructor not registered on system" });
    }

    const courses = await Course.find({ instructor: instructorId }).select(
      "courseCode courseTitle"
    );

    if (!courses.length) {
      return res
        .status(404)
        .json({ message: "No courses found for instructor" });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error fetching courses specify to instructor" });
  }
});

router.get("/:id/students", async (req, res) => {
  try {
    const courseId = req.params.id;

    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate(
      "student",
      "name email"
    );

    if (!enrollments.length) {
      return res
        .status(404)
        .json({ message: "No student enrolled in this course" });
    }

    const students = enrollments.map((enrollment) => ({
      name: enrollment.student.name,
      email: enrollment.student.email,
      grade: enrollment.grade,
      dateEnrolled: enrollment.dateEnrolled,
    }));

    return res.status(200).json({ students });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to get students enrolled in this course" });
  }
});

export default router;
