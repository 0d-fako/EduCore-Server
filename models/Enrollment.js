import mongoose from "mongoose";

const enrollmentSchema = mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, required: true },
  grade: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "Incomplete"],
    default: "Incomplete",
  },
  dateEnrolled: { type: Date, default: Date.now() },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
