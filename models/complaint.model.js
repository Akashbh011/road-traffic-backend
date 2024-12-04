import mongoose from 'mongoose'; // Import mongoose as the default export
const { Schema } = mongoose;
 const complaintSchema=new Schema(
    {
        longitude:{
            type:String,
            required:true
        },
        latitude:{
            type:String,
            required:true
        },
        src:{
            type:String,
        },
        category:{
            type:String,
            required:true
        },
        description: {
            type:String,
            required:true
        },
        isresolved:{
            type:Boolean,
            default:false
        },
    },
    {
        timestamps:true
    }
)

export const Complaint=mongoose.model("Complaint",complaintSchema);
