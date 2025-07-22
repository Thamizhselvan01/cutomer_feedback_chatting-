const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Please enter a subject for your ticket"],
      minlength: [5, "Subject must be at least 5 characters long"], // CORRECTED HERE
      maxlength: [100, "Subject cannot exceed 100 characters"], // CORRECTED HERE
    },
    description: {
      type: String,
      required: [true, "Please provide a detailed description"],
      minlength: [20, "Description must be at least 20 characters long"], // CORRECTED HERE
      maxlength: [1000, "Description cannot exceed 1000 characters"], // CORRECTED HERE
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    assignedTo: {
      type: String, // Will reference a User/Agent model later
      required: false,
    },
    messages: [
      {
        sender: {
          type: String, // 'User' or 'Agent'
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

// Create the Ticket Model from the schema
const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket; // Export the model
