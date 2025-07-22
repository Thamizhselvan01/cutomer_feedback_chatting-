const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDB");
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
// Make sure this line is present and correct
// In server.js (backend)
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
console.log(
  "Backend configured with FRONTEND_URL for CORS (for Socket.IO):",
  frontendUrl
); // <--- Add this line

// Middleware
// --- MODIFY THIS BLOCK HERE FOR EXPRESS CORS ---
app.use(
  cors({
    origin: frontendUrl, // THIS MUST BE frontendUrl for your API calls
    credentials: true, // Keep this if your frontend sends cookies/auth headers
  })
);
// --- END MODIFICATION ---
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const feedbackRoutes = require("./routes/FeedbackRoutes");
const ticketRoutes = require("./routes/TicketRoutes");

app.use("/api/feedback", feedbackRoutes);
app.use("/api/tickets", ticketRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: frontendUrl, // This MUST also be frontendUrl for Socket.IO
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // When a client sends a 'join_ticket' event, put them in a specific room

  socket.on("join_ticket", (ticketId) => {
    socket.join(ticketId); // Join a room named after the ticketId
    console.log(`User ${socket.id} joined room: ${ticketId}`);
  });

  socket.on("ticket_message", async (data) => {
    const { ticketId, sender, message } = data; // Save the message to the database // Note: For a truly robust system, you might move this db logic to a dedicated service or controller // For simplicity, we'll directly interact with the model here.

    try {
      const Ticket = require("./models/Ticket");
      const ticket = await Ticket.findById(ticketId);

      if (ticket) {
        const newMessage = { sender, message, timestamp: new Date() };
        ticket.messages.push(newMessage);
        await ticket.save(); // Emit the new message to everyone in the specific ticket room (including the sender)

        io.to(ticketId).emit("receive_message", newMessage);
        console.log(`Message sent to room ${ticketId}: ${message}`);
      } else {
        console.log(`Ticket not found: ${ticketId}`);
      }
    } catch (error) {
      console.error(`Error saving message to DB: ${error.message}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Start the server
const startServer = async () => {
  try {
    await connectDb();
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Access HTTP APIs at: http://localhost:${port}`);
      console.log(`Socket.IO listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();

module.exports = app;
