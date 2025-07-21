import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Import our components
import FeedbackForm from "./components/FeedbackFrom";
import FeedbackList from "./components/FeedBacklist";
import TicketForm from "./components/TicketFrom"; // New import
import TicketList from "./components/TicketList"; // New import
import TicketDetail from "./components/TicketDetail"; // New import
import "./App.css"

// Define your backend URL
const BACKEND_URL = "http://localhost:5000"; // Ensure this matches your backend's port

function App() {
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const [refreshFeedbackList, setRefreshFeedbackList] = useState(0);
  const [refreshTicketList, setRefreshTicketList] = useState(0); // New state for tickets refresh
  const [selectedTicket, setSelectedTicket] = useState(null); // State to hold the ticket object for detail view
  const [activeTab, setActiveTab] = useState("feedback"); // 'feedback' or 'tickets'

  useEffect(() => {
    // --- Test HTTP Backend Connection ---
    fetch(BACKEND_URL)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setBackendStatus(`HTTP Backend Connected: "${data}"`);
      })
      .catch((error) => {
        setBackendStatus(
          `HTTP Backend Error: ${error.message}. Is your backend server running?`
        );
        console.error("HTTP Backend Error:", error);
      });

    // --- Test Socket.IO Connection ---
    // We're handling the main app socket connection status here.
    // The specific ticket chat socket is handled within TicketDetail.jsx
    const mainSocket = io(BACKEND_URL);

    mainSocket.on("connect", () => {
      setSocketStatus(`Socket.IO Connected: ${mainSocket.id}`);
      console.log(`Frontend Main Socket.IO Connected: ${mainSocket.id}`);
    });

    mainSocket.on("disconnect", () => {
      setSocketStatus("Socket.IO Disconnected");
      console.log("Frontend Main Socket.IO Disconnected");
    });

    mainSocket.on("connect_error", (error) => {
      setSocketStatus(
        `Socket.IO Connection Error: ${error.message}. Check CORS settings on backend.`
      );
      console.error("Frontend Main Socket.IO Connection Error:", error);
    });

    return () => {
      mainSocket.disconnect();
    };
  }, []);

  const handleNewFeedbackSubmitted = (newFeedback) => {
    setRefreshFeedbackList((prev) => prev + 1);
    console.log(
      "New feedback submitted, triggering list refresh:",
      newFeedback
    );
  };

  const handleNewTicketSubmitted = (newTicket) => {
    setRefreshTicketList((prev) => prev + 1); // Trigger refresh of ticket list
    setSelectedTicket(newTicket); // Immediately show the detail of the newly created ticket
    console.log(
      "New ticket submitted, triggering list refresh and showing detail:",
      newTicket
    );
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket); // Set the selected ticket to display its details
  };

  const handleBackToList = () => {
    setSelectedTicket(null); // Clear selected ticket to go back to list view
    setRefreshTicketList((prev) => prev + 1); // Refresh list just in case status changed in detail view
  };

  return (
    <div style={appContainerStyle}>
      <h1 style={mainTitleStyle}>Customer Feedback & Support Dashboard</h1>

      {/* Connection Status Section */}
      <div style={statusBoxStyle}>
        <h2>Backend Connection Status:</h2>
        <p
          style={{
            color: backendStatus.includes("Error") ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {backendStatus}
        </p>
        <p
          style={{
            color: socketStatus.includes("Error") ? "red" : "blue",
            fontWeight: "bold",
          }}
        >
          {socketStatus}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={tabContainerStyle}>
        <button
          onClick={() => setActiveTab("feedback")}
          style={tabButtonStyle(activeTab === "feedback")}
        >
          Feedback
        </button>
        <button
          onClick={() => {
            setActiveTab("tickets");
            setSelectedTicket(null); // Ensure we go to ticket list, not a previous detail view
          }}
          style={tabButtonStyle(activeTab === "tickets")}
        >
          Tickets
        </button>
      </div>

      {/* Conditional Rendering based on activeTab */}
      {activeTab === "feedback" && (
        <section style={sectionStyle}>
          <FeedbackForm onNewFeedback={handleNewFeedbackSubmitted} />
          <FeedbackList refreshSignal={refreshFeedbackList} />
        </section>
      )}

      {activeTab === "tickets" && (
        <section style={sectionStyle}>
          {selectedTicket ? ( // If a ticket is selected, show TicketDetail
            <TicketDetail
              ticket={selectedTicket}
              onBackToList={handleBackToList}
            />
          ) : (
            // Otherwise, show TicketForm and TicketList
            <>
              <TicketForm onNewTicket={handleNewTicketSubmitted} />
              <TicketList
                refreshSignal={refreshTicketList}
                onSelectTicket={handleSelectTicket}
              />
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default App;

// --- Overall App Styles (reusing and adding) ---
const appContainerStyle = {
  fontFamily: "Arial, sans-serif",
  padding: "20px",
  backgroundColor: "#eef2f6",
  minHeight: "100vh",
};

const mainTitleStyle = {
  textAlign: "center",
  color: "#2c3e50",
  marginBottom: "40px",
  fontSize: "2.5em",
  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
};

const statusBoxStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  margin: "20px auto",
  maxWidth: "600px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  textAlign: "center",
};

const sectionStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  maxWidth: "1400px",
  margin: "40px auto",
  alignItems: "flex-start",
};

// Responsive adjustment
if (window.innerWidth < 900) {
  sectionStyle.gridTemplateColumns = "1fr";
}

const tabContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "30px",
};

const tabButtonStyle = (isActive) => ({
  padding: "12px 25px",
  fontSize: "1.1em",
  fontWeight: "bold",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  backgroundColor: isActive ? "#007bff" : "#e9ecef",
  color: isActive ? "white" : "#495057",
  transition: "all 0.3s ease",
  boxShadow: isActive ? "0 4px 8px rgba(0, 123, 255, 0.3)" : "none",
});
