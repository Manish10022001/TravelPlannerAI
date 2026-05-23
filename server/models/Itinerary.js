const mongoose = require("mongoose");
const crypto = require("crypto");

// Shape of one activity inside a day
const daySchema = new mongoose.Schema({
  day: Number,
  date: String,
  title: String,
  activities: [
    {
      time: String,
      title: String,
      description: String,
      location: String,
      type: {
        type: String,
        enum: ["flight", "hotel", "activity", "transport", "meal", "other"],
      },
    },
  ],
});

const itinerarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    destination: String,
    startDate: String,
    endDate: String,
    summary: String,
    days: [daySchema],
    extractedData: { type: mongoose.Schema.Types.Mixed }, // raw AI extraction result
    originalFiles: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
      },
    ],
    shareToken: { type: String, unique: true, sparse: true },
    isShared: { type: Boolean, default: false },
    shareExpiresAt: Date,
  },
  { timestamps: true }
);

// method to generate a pubblic share link token
itinerarySchema.methods.generateShareToken = function () {
  this.shareToken = crypto.randomBytes(32).toString("hex");
  this.isShared = true;
  return this.shareToken;
};

module.exports = mongoose.model("Itinerary", itinerarySchema);
