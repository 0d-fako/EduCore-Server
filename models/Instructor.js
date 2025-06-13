import mongoose from "mongoose";

import User from "./User.js";

const instructorSchema = mongoose.Schema({
  coursesTaught: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const Instructor = User.discriminator("Instructor", instructorSchema);

export default Instructor;
