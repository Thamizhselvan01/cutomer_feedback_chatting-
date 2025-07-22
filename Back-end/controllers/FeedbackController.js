const Feedback = require("../models/Feedback.js");

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }); // Find all feedback, sort newest first
    res.status(200).json(feedback); // Send back a 200 OK status with the feedback data
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const submitFeedback = async (req, res) => {
  // Destructure data from the request body
  const { user, category, message, rating } = req.body;

  // Basic validation (more robust validation can be added with libraries like express-validator)
  if (!category || !message) {
    return res
      .status(400)
      .json({
        message: "Please include all required fields: category and message",
      });
  }

  try {
    const newFeedback = await Feedback.create({
      user,
      category,
      message,
      rating,
      // status will default to 'New' as per our schema
    });
    res.status(201).json(newFeedback); // Send back a 201 Created status with the new feedback
  } catch (error) {
    // Handle Mongoose validation errors or other server errors
    res
      .status(400)
      .json({ message: "Failed to submit feedback", error: error.message });
  }
};

module.exports = {
  getAllFeedback,
  submitFeedback,
};
