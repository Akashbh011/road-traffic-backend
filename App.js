import express from "express";
import modelRoute from "./routes/model.route.js"
import connectDB from "./mongoose/connection.js"
import authRoute from "./routes/auth.route.js"

import complaintRoute from "./routes/complaint.route.js"

import dotenv from "dotenv";
dotenv.config();

import cors from "cors" ;
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,              
}));
app.use(express.json());


connectDB().then(()=>{
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
}).catch((err)=>{
    console.log("MONGODB connection failed!!! ",err)
})
app.use("/api/auth",authRoute);


app.use("/api/model",modelRoute);

app.use("/api/complaint",complaintRoute);
