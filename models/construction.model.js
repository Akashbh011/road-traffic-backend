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
        startTime: { 
            type: Date, 
            required: true 
        },
    polyline: [  
      {
        lat: {
          type: Number,
          required: true
        },
        long: {
          type: Number,
          required: true
        }
      }
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
    timestamps: true  // Automatically adds createdAt and updatedAt fields
  }
);

export const Construction = mongoose.model('Construction', constructionSchema);
