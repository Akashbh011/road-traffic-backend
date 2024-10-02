import express from "express";
import modelRoute from "./routes/model.route.js"
import connectDB from "./mongoose/connection.js"
import userRoute from "./routes/user.route.js"
import loginRoute from "./routes/userLogin.route.js" 

import dotenv from "dotenv";
dotenv.config();

import cors from "cors" ;
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());


connectDB().then(()=>{
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
}).catch((err)=>{
    console.log("MONGODB connection failed!!! ",err)
})
app.use("/api/register",userRoute);

app.use("/api/login",loginRoute);

app.use("/api/model",modelRoute);

app.use("/api/complaint",modelRoute);
