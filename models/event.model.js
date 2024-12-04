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
    location: {
      type: {
        type: String,
        enum: ['Point', 'LineString'],
        required: true
      },
      coordinates: {
        type: Array,
        required: true,
        validate: {
          validator: function(v) {
            if (this.location.type === 'Point') {
              return Array.isArray(v) && v.length === 2 &&
                     !isNaN(v[0]) && !isNaN(v[1]);
            }
            if (this.location.type === 'LineString') {
              return Array.isArray(v) && v.length >= 2 &&
                     v.every(coord => Array.isArray(coord) && 
                     coord.length === 2 && 
                     !isNaN(coord[0]) && !isNaN(coord[1]));
            }
            return false;
          },
          message: props => {
            if (props.this.location.type === 'Point') {
              return 'Point must have exactly two numbers for coordinates';
            }
            return 'LineString must have at least two valid coordinate pairs';
          }
        }
      }
    }
  });
export const Event = mongoose.model("Event", eventSchema);

