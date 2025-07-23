const express = require("express");
const cors = require("cors"); // Keep this one
const connectDb = require("./config/connectDB");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Ticket = require("./models/Ticket"); // <-- Moved this import here

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// IMPORTANT: Uncomment this line!
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
console.log(
  "Backend configured with FRONTEND_URL for CORS (for Express & Socket.IO):",
  frontendUrl
);

// Middleware
app.use(express.json()); // For parsing JSON request bodies

// Express CORS Middleware
app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS for preflight requests
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const feedbackRoutes = require("./routes/FeedbackRoutes");
const ticketRoutes = require("./routes/TicketRoutes");

app.use("/api/feedback", feedbackRoutes);
app.use("/api/tickets", ticketRoutes);

const httpServer = createServer(app);

// Socket.IO Server Setup
const io = new Server(httpServer, {
  cors: {
    origin: frontendUrl, // This MUST also be frontendUrl for Socket.IO
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure comprehensive methods
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_ticket", (ticketId) => {
    socket.join(ticketId);
    console.log(`User ${socket.id} joined room: ${ticketId}`);
  });

  socket.on("ticket_message", async (data) => {
    const { ticketId, sender, message } = data;

    try {
      // Ticket model is now imported at the top
      const ticket = await Ticket.findById(ticketId);

      if (ticket) {
        const newMessage = { sender, message, timestamp: new Date() };
        ticket.messages.push(newMessage);
        await ticket.save();

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
    // Connect to MongoDB
    await connectDb(); // This function should handle the actual MongoDB connection

    // Start listening for HTTP and Socket.IO connections
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Access HTTP APIs at: http://localhost:${port}`); // Note: This will be your Render URL when deployed
      console.log(`Socket.IO listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    // Exit the process if the server fails to start after a critical error
    process.exit(1); // This is good practice for critical startup failures
  }
};

startServer();

// module.exports = app; // Usually not needed if you're running server.js directly
