const { io } = require("socket.io-client"); // Import the client-side Socket.IO library

const SOCKET_SERVER_URL = "http://localhost:2000"; // Our backend URL

// Connect as a simulated 'User'
const userSocket = io(SOCKET_SERVER_URL);

// Connect as a simulated 'Agent'
const agentSocket = io(SOCKET_SERVER_URL);

const TEST_TICKET_ID = '687b5857b70fe7ee67f6b60c'; // *** IMPORTANT: Replace with an actual Ticket ID from your DB ***

// --- User Socket Listeners ---
userSocket.on("connect", () => {
  console.log(`User Socket Connected: ${userSocket.id}`);
  userSocket.emit('join_ticket', TEST_TICKET_ID); // User joins the ticket room
});

userSocket.on("receive_message", (message) => {
  console.log(`User received message for ticket ${TEST_TICKET_ID}: [${message.sender}] ${message.message}`);
});

userSocket.on("disconnect", () => {
  console.log(`User Socket Disconnected: ${userSocket.id}`);
});


// --- Agent Socket Listeners ---
agentSocket.on("connect", () => {
  console.log(`Agent Socket Connected: ${agentSocket.id}`);
  agentSocket.emit('join_ticket', TEST_TICKET_ID); // Agent joins the same ticket room
});

agentSocket.on("receive_message", (message) => {
  console.log(`Agent received message for ticket ${TEST_TICKET_ID}: [${message.sender}] ${message.message}`);
});

agentSocket.on("disconnect", () => {
  console.log(`Agent Socket Disconnected: ${agentSocket.id}`);
});

// --- Simulate Messages After a Delay ---
setTimeout(() => {
  // User sends a message
  userSocket.emit('ticket_message', {
    ticketId: TEST_TICKET_ID,
    sender: 'User',
    message: 'My app is still crashing, any updates?'
  });
  console.log(`User sent message: My app is still crashing, any updates?`);
}, 3000); // Wait 3 seconds after connection

setTimeout(() => {
  // Agent sends a reply
  agentSocket.emit('ticket_message', {
    ticketId: TEST_TICKET_ID,
    sender: 'Agent',
    message: 'We are actively investigating this. We will get back to you shortly.'
  });
  console.log(`Agent sent message: We are actively investigating this. We will get back to you shortly.`);
}, 6000); // Wait 6 seconds

setTimeout(() => {
  userSocket.disconnect();
  agentSocket.disconnect();
  console.log("Simulated clients disconnected.");
  process.exit(0); // Exit the script
}, 10000); // Disconnect after 10 seconds