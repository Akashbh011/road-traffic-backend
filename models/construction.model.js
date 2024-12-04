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
        coordinates: {
            type: Array,
            required: true,
            validate: {
            validator: function(v) {
                          return Array.isArray(v) && v.length >= 2 &&
                                 v.every(coord => Array.isArray(coord) && 
                                 coord.length === 2 && 
                                 !isNaN(coord[0]) && !isNaN(coord[1]));
                        },
            }
      },
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
