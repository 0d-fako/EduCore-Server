import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import loginRoute from "./routes/auth/login.js";
import signupRoute from "./routes/auth/signup.js";
import courseRoute from "./routes/courseController.js";
import enrollmentRoute from "./routes/enrollmentController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/auth/login", loginRoute);
app.use("/api/auth/signup", signupRoute);

app.use("/api/courses", courseRoute);
app.use("/api/enrollments", enrollmentRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the EduCare API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
