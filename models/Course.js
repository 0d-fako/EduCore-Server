import mongoose from "mongoose"

const courseSchema = mongoose.Schema({
    courseCode : {type : String, required: true},
    courseTitle: {type: String, required: true},
    courseDescription: {type : String},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    
})

const Course = mongoose.model("Course", courseSchema);

export default Course;

