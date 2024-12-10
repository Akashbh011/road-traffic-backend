import mongoose from 'mongoose'; 
const { Schema } = mongoose;

const diversionSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    diversionPoints: [
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
    type: {
      type: String,
      enum: ['Metro-construction', 'Road-construction', 'Flyover-construction'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Diversion = mongoose.model('Diversion', diversionSchema);
