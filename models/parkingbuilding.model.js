import mongoose from 'mongoose'; // Import mongoose as the default export

const { Schema } = mongoose;

 const parkingBuildingSchema=new Schema(
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
    },
    {
        timestamps:true
    }
)

export const ParkingBuilding=mongoose.model("Parkingbuilding", parkingBuildingSchema);
