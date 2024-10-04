import mongoose from 'mongoose'; // Import mongoose as the default export
const { Schema } = mongoose;

 const imageSchema=new Schema(
    {
        src:{
            type:String,
            required :true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        longitude:{
            type:Number,
            required:true
        },
        latitude:{
            type:Number,
            required:true
        }, 
        isresolved:{
            type:Boolean,
            required:true,
            default:false
        }
    },
    {
        timestamps:true
    }
)

export const Image=mongoose.model("Image",imageSchema);
