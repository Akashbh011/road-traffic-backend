import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (locaFilePath) =>{
    try{
        if(!locaFilePath) {
            return null
        }
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(locaFilePath,{
            resource_type: "auto"
        })
        //File has been uploaded successfully
        console.log("File is uploade on cloudinary",response.url);
        fs.unlinkSync(locaFilePath)
        return response
    }catch(error){
        fs.unlinkSync(locaFilePath) //remove the locally saved temporary files as upload operation failed
        return null
    }   
}

export {uploadOnCloudinary}