import express from "express";
import modelRoute from "./routes/model.route.js"
import connectDB from "./mongoose/connection.js"
import authRoute from "./routes/auth.route.js"
import complaintRoute from "./routes/complaint.route.js"
import eventRoute from "./routes/event.route.js"
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"
import nearbyRoute from "./routes/nearby.route.js"

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
app.use("/api/user",userRoute)
app.use("/api/nearby",nearbyRoute)


// THIS IS THE URL ON WHICH WE ARE GETTING THE JSON DATA FROM PLACES API
//  https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.49968545,73.85688275180982&radius=10000&type=school&key=AIzaSyAs6xHZ_UEGk5IFF2V620vsgnMOoOrqepY