import express from "express";
import modelRoute from "./routes/model.route.js"
import connectDB from "./mongoose/connection.js"
import authRoute from "./routes/auth.route.js"
import complaintRoute from "./routes/complaint.route.js"
import eventRoute from "./routes/event.route.js"
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"
import nearbyRoute from "./routes/nearby.route.js"
import banquethallRoute from "./routes/banquethall.route.js"
import constructionRoute from "./routes/construction.route.js"
import divserionRoute from "./routes/diversion.route.js"
import gardenRoute from "./routes/garden.route.js"
import hospitalRoute from "./routes/hospital.route.js"
import mallRoute from "./routes/mall.route.js"
import parkingbuildingRoute from "./routes/parkingbuilding.route.js"
import schoolRoute from "./routes/school.route.js"
import hotelRoute from "./routes/hotel.route.js"
import PathInfoRoute from "./routes/pathinfo.route.js";
import trafficStatusRoute from "./routes/trafficstatus.route.js";

import cookieParser from "cookie-parser";


dotenv.config({
    path: './.env'
})

import cors from "cors" ;
const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
    "https://form-data-collection.onrender.com", 
    "https://road-traffic-frontend.onrender.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,              
}));

app.all('*', function(req, res, next) {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


app.use(express.json());
app.use(cookieParser());


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
app.use("/api/event",eventRoute);
app.use("/api/user",userRoute);
app.use("/api/nearby",nearbyRoute);
app.use("/api/banquethall", banquethallRoute);
app.use("/api/construction", constructionRoute);
app.use("/api/diversion", divserionRoute);
app.use("/api/garden", gardenRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/hospital", hospitalRoute);
app.use("/api/mall", mallRoute);
app.use("/api/parkingbuilding", parkingbuildingRoute);
app.use("/api/school", schoolRoute);
app.use("/api/path-info",PathInfoRoute);
app.use("/api/traffic-status",trafficStatusRoute);