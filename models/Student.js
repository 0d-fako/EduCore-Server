import mongoose from "mongoose";

import User from "./User.js";

const studentSchema = mongoose.Schema({
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const Student = User.discriminator("Student", studentSchema);

export default Student;
