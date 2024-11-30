import mongoose from 'mongoose'; // Import mongoose as the default export
const { Schema } = mongoose;
 const complaintSchema=new Schema(
    {
        
        user:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
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
            required:true
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
