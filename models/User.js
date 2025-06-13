import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email:{type: String, required: true},
    password:{type: String, required: true}

},
    {
        timestamps: true,
        discriminatorKey: "role",
    }

)

const User = mongoose.model("User", userSchema);
export default User;
