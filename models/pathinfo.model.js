import mongoose from 'mongoose';

const pathInfoSchema = new mongoose.Schema({
  pathId: {
    type: String,
    required: true,
  },
  timeRange: {
    type: String,
    required: true,
    enum: [
      '00-02', '02-04', '04-06', '06-08', '08-10', '10-12', 
      '12-14', '14-16', '16-18', '18-20', '20-22', '22-24',
    ],
  },
  date: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0, 
  },
  level: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high','very high','very low'], 
  },
}, {
  timestamps: true, 
});

const PathInfo = mongoose.model('PathInfo', pathInfoSchema);

export default PathInfo;
