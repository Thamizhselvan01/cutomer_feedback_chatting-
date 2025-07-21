const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  submitTicket,
  updateTicket,
  addTicketMessage,
} = require('../controllers/TicketController');

// Define routes for tickets
router.get('/', getAllTickets); // GET /api/tickets -> Get all tickets
router.post('/', submitTicket); // POST /api/tickets -> Submit a new ticket
router.get('/:id', getTicketById); // GET /api/tickets/:id -> Get a single ticket
router.put('/:id', updateTicket); // PUT /api/tickets/:id -> Update a ticket
router.post('/:id/messages', addTicketMessage); // POST /api/tickets/:id/messages -> Add a message to a ticket

module.exports = router;