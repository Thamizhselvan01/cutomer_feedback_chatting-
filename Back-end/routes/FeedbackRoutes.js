// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/FeedbackController"); // <--- CORRECTED PATH HERE!

router.post("/", feedbackController.submitFeedback); // Assuming you want to use submitFeedback from your controller
router.get("/", feedbackController.getAllFeedback);

module.exports = router;
