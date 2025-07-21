const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: false,
      default: "Anonymous",
    },
    category: {
      type: String,
      required: [true, "Please select a category for your feedback"],
      enum: ["Bug Report", "Feature Request", "General Inquiry", "Other"], // Enforce specific values
    },
    message: {
      type: String,
      required: [true, "Please enter your feedback message"],
      min_length: [10, "Feedback message must be at least 10 characters long"],
      max_length: [500, "Feedback message cannot exceed 500 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false, // Rating might be optional for some feedback types
    },
    status: {
      type: String,
      enum: ["New", "Reviewed", "Archived"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedBackSchema);

module.exports = Feedback;
