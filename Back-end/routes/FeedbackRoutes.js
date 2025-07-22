// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('./controllers/feedbackController'); // Ensure path is correct

router.post('/', feedbackController.createFeedback); // <--- ENSURE THIS LINE EXISTS AND IS CORRECT

router.get('/', feedbackController.getAllFeedback); // You confirmed GET works, so this is likely fine

module.exports = router;