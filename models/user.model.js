import mongoose from 'mongoose'; // Import mongoose as the default export
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    
    username: {
      type: String,
      required: true,
    },
    email:{
      type:String,
      required:true
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length for security
    },
    mobile_number: {
      type: String,
      required: true,
      unique: true, // Ensure phone numbers are unique
    }, 
    citizen_score:{
      type:Number,
      default:0,
    },
    role:{
      type:String,
      default:"user"
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export const User = mongoose.model('User', userSchema);
