import mongoose from 'mongoose'; // Import mongoose as the default export
const { Schema } = mongoose;

 const diversionSchema=new Schema(
    {     
        projectName:{
            type:String,
            required:true
        },
        vendorName:{
            type:String,
            required:true
        },
        startTime: { 
            type: Date, 
            required: true 
        },
        endTime: { 
            type: Date, 
            required: true 
        },
        longitude:{
            type:String,
            required:true
        },
        latitude:{
            type:String,
            required:true
        },
        type:{
            type:String,
            enum: ['Metro-construction', 'Road-construction','Flyover-construction'],
            required:true
        },
    },
    {
        timestamps:true
    }
)

export const Diversion=mongoose.model("Diversion",diversionSchema);
