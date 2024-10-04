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
        complaint:{
            type:String,
            required:true
        },
        isresolved:{
            type:Boolean,
            required:true,
            default:false
        },
        category:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Complaint=mongoose.model("Complaint",complaintSchema);
