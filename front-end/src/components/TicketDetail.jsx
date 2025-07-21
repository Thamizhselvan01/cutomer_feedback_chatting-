import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import styles from "./TicketDetail.module.css"; // Correct import for CSS module

const BACKEND_URL = "http://localhost:5000"; // Ensure this matches your backend's port
const TICKET_API_URL = `${BACKEND_URL}/api/tickets`;

function TicketDetail({ ticket, onBackToList }) {
  const [messages, setMessages] = useState(ticket.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || '');
  const [currentSender, setCurrentSender] = useState("User"); // State to toggle message sender

  const socket = useRef(null);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to bottom of chat

  // --- Socket.IO Real-time Chat Logic ---
  useEffect(() => {
    // Initialize socket connection if it doesn't exist
    if (!socket.current) {
      socket.current = io(BACKEND_URL);

      socket.current.on("connect", () => {
        console.log(
          `Socket.IO connected for ticket detail: ${socket.current.id}`
        );
        // Join the specific ticket's room
        socket.current.emit("join_ticket", ticket._id);
      });

      socket.current.on("receive_message", (message) => {
        console.log("Received real-time message:", message);
        // Update messages state when a new message is received
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.current.on("disconnect", () => {
        console.log("Socket.IO disconnected for ticket detail.");
      });

      socket.current.on("connect_error", (err) => {
        console.error("Socket.IO connection error for ticket detail:", err);
        setError(`Socket connection error: ${err.message}`);
      });
    } else {
      // If socket already exists, ensure it joins the correct room (e.g., if ticket changes)
      socket.current.emit("join_ticket", ticket._id);
    }

    // Cleanup function: disconnect and leave room when component unmounts
    return () => {
      if (socket.current) {
        console.log(`Leaving room ${ticket._id} and disconnecting socket.`);
        socket.current.emit("leave_ticket", ticket._id); // Optional: if you add leave_ticket event on backend
        socket.current.disconnect();
        socket.current = null; // Clear the ref
      }
    };
  }, [ticket._id]); // Re-run effect if ticket ID changes (e.g., selecting a different ticket)

  // Scroll to the bottom of the messages list whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // --- HTTP API for Sending Message and Updating Ticket ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return; // Don't send empty messages

    const messageData = {
      sender: currentSender, // Use the state variable here
      message: newMessage.trim(),
      timestamp: new Date().toISOString() // Add timestamp here for immediate display if needed
    };

    // Emit message via Socket.IO for real-time display
    // The backend will save it to DB and broadcast it to the room
    socket.current.emit("ticket_message", {
      ticketId: ticket._id,
      ...messageData,
    });

    setNewMessage(""); // Clear input field
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setLoading(true);
    try {
      const response = await fetch(`${TICKET_API_URL}/${ticket._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(`Failed to update status: ${data.message}`);
      } else {
        // Optionally, if status updates need to be broadcasted live, emit a socket event.
        // For now, we rely on a manual refresh or a new fetch for list updates.
      }
    } catch (err) {
      setError(`Network error updating status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignedToChange = async (e) => {
    const newAssignedTo = e.target.value;
    setAssignedTo(newAssignedTo);
    setLoading(true);
    try {
      const response = await fetch(`${TICKET_API_URL}/${ticket._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: newAssignedTo }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(`Failed to update assignment: ${data.message}`);
      }
    } catch (err) {
      setError(`Network error updating assignment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get priority class for styling
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return styles.priorityUrgent;
      case 'High': return styles.priorityHigh;
      case 'Medium': return styles.priorityMedium;
      case 'Low': return styles.priorityLow;
      default: return '';
    }
  };

  // Helper to get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return styles.statusBadgeOpen;
      case 'In Progress': return styles.statusBadgeInProgress;
      case 'Resolved': return styles.statusBadgeResolved;
      case 'Closed': return styles.statusBadgeClosed;
      default: return '';
    }
  };

  // Format message timestamp
  const formatMessageTimestamp = (timestamp) => {
    // Ensure timestamp is a valid Date object before calling toLocaleString
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  return (
    <div className={styles.detailContainer}> {/* Main container */}
      <button onClick={onBackToList} className={styles.backButton}>
        &larr; Back to Tickets
      </button>

      {/* Error and Loading Messages */}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {loading && <p className={styles.messageText}>Updating...</p>}

      {/* Ticket Info & Description Section */}
      <div className={styles.infoGridAndDescription}>
        <h2 className={styles.sectionTitle}>Ticket: {ticket.subject}</h2>

        <div className={styles.ticketInfoGrid}>
          <div className={styles.infoItem}>
            <strong>Submitted By:</strong> <span>{ticket.user}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Priority:</strong>{" "}
            <span className={`${styles.priority} ${getPriorityClass(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
          <div className={styles.infoItem}>
            <strong>Status:</strong>
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              className={`${styles.statusSelect} ${getStatusClass(currentStatus)}`}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className={styles.infoItem}>
            <strong>Assigned To:</strong>
            <input
              type="text"
              value={assignedTo}
              onChange={handleAssignedToChange}
              placeholder="Assign agent"
              className={styles.assignedToInput}
            />
          </div>
          <div className={styles.infoItem}>
            <strong>Created:</strong>{" "}
            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Last Updated:</strong>{" "}
            <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Description:</h3>
        <p className={styles.descriptionP}>{ticket.description}</p>
      </div>

      {/* Chat History Section */}
      <h3 className={styles.sectionTitle}>Chat History:</h3>
      <div className={styles.chatBox}> {/* Apply chatBox style */}
        {messages.length === 0 ? (
          <p className={styles.messageText}> {/* Use messageText for no messages */}
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => {
            // Apply conditional message styling (user/agent)
            const messageClass = msg.sender === "User" ? styles.messageUser : styles.messageAgent;
            return (
              <div key={index} className={`${styles.message} ${messageClass}`}>
                <strong>{msg.sender}:</strong> {msg.message}
                <span className={styles.smallTimestamp}>
                  {formatMessageTimestamp(msg.timestamp)}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSendMessage} className={styles.chatForm}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.chatButton}>
          Send
        </button>
      </form>

      {/* Sender Toggle */}
      <div className={styles.senderToggle}>
        <strong>Send as:</strong>
        <button
          onClick={() => setCurrentSender("User")}
          className={`${styles.senderButton} ${currentSender === "User" ? styles.senderButtonActive : ''}`}
        >
          User
        </button>
        <button
          onClick={() => setCurrentSender("Agent")}
          className={`${styles.senderButton} ${currentSender === "Agent" ? styles.senderButtonActive : ''}`}
        >
          Agent
        </button>
      </div>
    </div>
  );
}

export default TicketDetail;