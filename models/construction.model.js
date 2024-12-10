import mongoose from 'mongoose'; 
const { Schema } = mongoose;

const constructionSchema = new Schema(
  {
      projectName:{
        type:String,
        required:true
      },
      vendorName:{
        type:String,
        required:true
      },
      type:{
        type: String,
        enum: ['Metro-construction', 'Road-construction', 'Flyover-construction'],
        required: true,
      },
      constructionPoints: [
      {
        lat: {
          type: Number, 
          required: true,
        },
        lng: {
          type: Number, 
          required: true,
        },
      },
      ], 
    startDate: {
      type: Date,
      required: true
    },
    expectedEndDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],  
      default: 'active'
    }
  },
  {
    timestamps: true 
  }
);

export const Construction = mongoose.model('Construction', constructionSchema);
