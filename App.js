import express from "express";
import modelRoute from "./routes/model.route.js"
import connectDB from "./mongoose/connection.js"
import authRoute from "./routes/auth.route.js"
import complaintRoute from "./routes/complaint.route.js"
import eventRoute from "./routes/event.route.js"
import dotenv from "dotenv";



dotenv.config({
    path: './.env'
})

import cors from "cors" ;
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,              
}));
app.use(express.json());


connectDB()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
}).catch((err)=>{
    console.log("MONGODB connection failed!!! ",err)
})


app.use("/api/auth",authRoute);
app.use("/api/model",modelRoute);
app.use("/api/complaint",complaintRoute);
app.use("/api/event",eventRoute)

