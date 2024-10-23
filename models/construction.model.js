import mongoose from 'mongoose'; 
const { Schema } = mongoose;

const constructionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['metro', 'flyover'], 
      required: true
    },
    name: {
      type: String,
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
