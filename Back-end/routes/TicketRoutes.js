// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/TicketController'); // <--- **THIS IS THE CRITICAL FIX!**

router.post('/', ticketController.submitTicket); // Changed to submitTicket based on your controller exports
router.get('/', ticketController.getAllTickets);

module.exports = router;