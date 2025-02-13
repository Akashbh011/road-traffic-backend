import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try{
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,  { serverSelectionTimeoutMS: 5000 },{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }) 
       console.log("DB connected")
    }catch (error){
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

export default connectDB;