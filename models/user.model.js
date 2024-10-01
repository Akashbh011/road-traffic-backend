import mongoose from 'mongoose'; // Import mongoose as the default export
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    
    name: {
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
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Ensure phone numbers are unique
    },
    
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export const User = mongoose.model('User', userSchema);
