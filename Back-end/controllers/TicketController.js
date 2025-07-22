const Ticket = require("../models/Ticket.js");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    // Handle invalid ID format (e.g., not a valid MongoDB ObjectId)
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Ticket not found with provided ID" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const submitTicket = async (req, res) => {
  const { user, subject, description, priority } = req.body;

  if (!subject || !description) {
    return res.status(400).json({
      message: "Please include all required fields: subject and description",
    });
  }

  try {
    const newTicket = await Ticket.create({
      user,
      subject,
      description,
      priority,
      // status will default to 'Open', messages will be an empty array
    });
    res.status(201).json(newTicket);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to submit ticket", error: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only allow certain fields to be updated for security/logic
    const { status, assignedTo, priority } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (assignedTo) updateFields.assignedTo = assignedTo;
    if (priority) updateFields.priority = priority;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Use $set to update specific fields
      { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` runs schema validators
    );

    res.status(200).json(updatedTicket);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Ticket not found with provided ID" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addTicketMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, message } = req.body;

    if (!sender || !message) {
      return res
        .status(400)
        .json({ message: "Sender and message are required" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.messages.push({ sender, message }); // Push new message to the array
    await ticket.save(); // Save the updated ticket

    res.status(201).json(ticket.messages[ticket.messages.length - 1]); // Return the newly added message
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Ticket not found with provided ID" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  submitTicket,
  updateTicket,
  addTicketMessage,
};
