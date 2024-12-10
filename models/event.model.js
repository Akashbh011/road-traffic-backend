/*import mongoose from 'mongoose'; 
const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        longitude: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const Event = mongoose.model("Event", eventSchema);*/

import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new mongoose.Schema({
    category: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    crowd: { type: Number, required: true },
    vehicleCount: {type: Number, required: true },
    eventPoints: [
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
  });
export const Event = mongoose.model("Event", eventSchema);

