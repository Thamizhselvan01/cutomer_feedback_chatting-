// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('./controllers/ticketController'); // Ensure path is correct

router.post('/', ticketController.createTicket); // <--- ENSURE THIS LINE EXISTS AND IS CORRECT

router.get('/', ticketController.getAllTickets); // You confirmed GET works, so this is likely fine

module.exports = router;