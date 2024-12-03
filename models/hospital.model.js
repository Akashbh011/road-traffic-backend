import mongoose from 'mongoose'; // Import mongoose as the default export

const { Schema } = mongoose;

 const hospitalSchema=new Schema(
    {
        longitude:{
            type:String,
            required:true
        },
        latitude:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        capacity:{
            type:Number,
            required:true
        },
    },
    {
        timestamps:true
    }
)

export const Hospital=mongoose.model("Hospital", hospitalSchema);
