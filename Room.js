const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
      default: 1,
    },
    type: {
      type: String,
      enum: ['Classroom', 'Lecture Hall', 'Tutorial Room', 'Lab', 'Studio', 'Seminar Hall'],
      default: 'Classroom',
    },
    capacity: {
      type: Number,
      default: 60,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    claimedBy: {
      type: String,
      default: null,
      trim: true,
    },
    nearestCanteen: {
      type: String,
      required: true,
      enum: ['Fusion Cafe', 'Chai Adda', 'Maggie Point', 'Le Broc'],
    },
  },
  { timestamps: true }
);

// Index for fast canteen + claimed queries
RoomSchema.index({ nearestCanteen: 1, isClaimed: 1 });
RoomSchema.index({ block: 1, isClaimed: 1 });

module.exports = mongoose.model('Room', RoomSchema);
