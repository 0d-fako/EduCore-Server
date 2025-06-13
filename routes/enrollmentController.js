import Student from "../models/Student.js";
import express from "express";

const router = express.Router();

router.get("/enrollments", async (req, res) => {
  try {
    const students = await Student.find().populate(
      "enrolledCourses",
      "courseTitle courseCode"
    );
    return res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve enrollments." });
  }
});

router.post("/enroll", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await Student.findById(studentId);
    if (!student || student.role !== "Student") {
      return res
        .status(403)
        .json({ message: "Only students can enroll in courses." });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "Student already enrolled in this course." });
    }

    const newEnrollment = new Enrollment({
      student: studentId,
      course: courseId,
    });
    await newEnrollment.save();

    student.enrolledCourses.push(courseId);
    await student.save();

    return res
      .status(201)
      .json({ message: "Enrollment successful!", enrollment: newEnrollment });
  } catch (error) {
    console.error("Enrollment Error:", error);
    return res.status(500).json({ message: "Failed to enroll student." });
  }
});

router.put("/enroll/:id/update-grade", async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, instructorId } = req.body;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res
        .status(403)
        .json({ message: "Only instructors can update grades." });
    }

    if (!["A", "B", "C", "D", "E", "Incomplete"].includes(grade)) {
      return res.status(400).json({ message: "Invalid grade value." });
    }

    let enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment record not found." });
    }

    enrollment.grade = grade;
    await enrollment.save();

    return res
      .status(200)
      .json({ message: "Grade updated successfully!", enrollment });
  } catch (error) {
    console.error("Grade Update Error:", error);
    return res.status(500).json({ message: "Failed to update grade." });
  }
});

router.delete("/enroll/:id/unenroll", async (req, res) => {
  try {
    const { id, instructorId } = req.body;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res
        .status(403)
        .json({ message: "Only instructors can unenroll students." });
    }

    let enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment record not found." });
    }

    let student = await Student.findById(enrollment.student);
    if (student) {
      student.enrolledCourses = student.enrolledCourses.filter(
        (course) => course.toString() !== enrollment.course.toString()
      );
      await student.save();
    }

    await Enrollment.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Student successfully unenrolled from the course." });
  } catch (error) {
    console.error("Unenrollment Error:", error);
    return res.status(500).json({ message: "Failed to unenroll student." });
  }
});
export default router;
