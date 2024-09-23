import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const itServiceSchema = new mongoose.Schema(
  {
    ServiceID: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: false,
    },
    Price: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      enum: ['Installation', 'Maintenance', 'Repair', 'Inspection','Other'],
      required: true,
    },
    Duration: {
      type: Number, // Duration in hours
      required: true,
    },
    ImageURL: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ITService = mongoose.model('ITService', itServiceSchema);

export default ITService;
