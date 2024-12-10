import mongoose from 'mongoose';
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
      minlength: 6, 
    },
    mobile_number: {
      type: String,
      required: true,
      unique: true,
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
    timestamps: true, 
  }
);

export const User = mongoose.model('User', userSchema);
