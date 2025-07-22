// const Feedback = require("../models/Feedback");

// const getAllFeedback = async (req, res) => {
//   try {
//     const feedback = await Feedback.find().sort({ createdAt: -1 }); // Find all feedback, sort newest first
//     res.status(200).json(feedback); // Send back a 200 OK status with the feedback data
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// const submitFeedback = async (req, res) => {
//   // Destructure data from the request body
//   const { user, category, message, rating } = req.body;

//   // Basic validation (more robust validation can be added with libraries like express-validator)
//   if (!category || !message) {
//     return res
//       .status(400)
//       .json({
//         message: "Please include all required fields: category and message",
//       });
//   }

//   try {
//     const newFeedback = await Feedback.create({
//       user,
//       category,
//       message,
//       rating,
//       // status will default to 'New' as per our schema
//     });
//     res.status(201).json(newFeedback); // Send back a 201 Created status with the new feedback
//   } catch (error) {
//     // Handle Mongoose validation errors or other server errors
//     res
//       .status(400)
//       .json({ message: "Failed to submit feedback", error: error.message });
//   }
// };

// module.exports = {
//   getAllFeedback,
//   submitFeedback,
// };

const Feedback = require("../models/Feedback"); // Keep this line, but we won't use it for now

const getAllFeedback = async (req, res) => {
  try {
    // --- TEMPORARY DEBUGGING CODE ---
    const dummyFeedback = [
      { id: '1', category: 'General Inquiry', message: 'Dummy feedback 1', status: 'New', createdAt: new Date() },
      { id: '2', category: 'Bug Report', message: 'Dummy feedback 2', status: 'Reviewed', createdAt: new Date() },
    ];
    res.status(200).json(dummyFeedback);
    console.log("Returned dummy feedback data."); // Add a console log to see if it reaches here
    // --- END TEMPORARY DEBUGGING CODE ---
    // const feedback = await Feedback.find().sort({ createdAt: -1 }); // COMMENT OUT THIS LINE
    // res.status(200).json(feedback); // COMMENT OUT THIS LINE
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const submitFeedback = async (req, res) => {
  // You can leave submitFeedback as is, or also comment out its DB interaction for now
  // For the purpose of testing the GET, you might not even need to touch submitFeedback.
  const { user, category, message, rating } = req.body;
  if (!category || !message) {
    return res.status(400).json({ message: "Please include all required fields: category and message", });
  }
  try {
    // const newFeedback = await Feedback.create({ // COMMENT OUT THIS LINE
    //   user, category, message, rating,
    // });
    // res.status(201).json(newFeedback); // COMMENT OUT THIS LINE
    res.status(201).json({ message: "Dummy feedback submitted!", user, category, message, rating }); // ADD THIS
    console.log("Returned dummy feedback submission success."); // Add a console log
  } catch (error) {
    res.status(400).json({ message: "Failed to submit feedback", error: error.message });
  }
};

module.exports = {
  getAllFeedback,
  submitFeedback,
};