import mongoose from 'mongoose'; // Import mongoose as the default export

const { Schema } = mongoose;

 const hotelSchema=new Schema(
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
        parkingCapacity:{
            type:Number,
            required:true
        },
        crowdCapacity:{
            type:Number,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Hotel=mongoose.model("Hotel", hotelSchema);
