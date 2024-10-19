import mongoose from 'mongoose'; 
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

export const Event = mongoose.model("Event", eventSchema);
