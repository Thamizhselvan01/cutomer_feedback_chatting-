import React, { useEffect, useState } from "react";
import styles from "./TicketList.module.css"; // <<< IMPORT CSS MODULE

const TICKET_API_URL = "http://localhost:5000/api/tickets";

function TicketList({ refreshSignal, onSelectTicket }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(TICKET_API_URL);
      const data = await response.json();

      if (response.ok) {
        setTickets(data);
      } else {
        setError(data.message || "Failed to fetch tickets.");
      }
    } catch (err) {
      setError(`Network Error: ${err.message}. Is backend running?`);
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refreshSignal]);

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return styles.statusOpen;
      case "In Progress":
        return styles.statusInProgress;
      case "Resolved":
        return styles.statusResolved;
      case "Closed":
        return styles.statusClosed;
      default:
        return "";
    }
  };

  // Helper function to get priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return styles.priorityUrgent;
      case "High":
        return styles.priorityHigh;
      case "Medium":
        return styles.priorityMedium;
      case "Low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  if (loading) return <p className={styles.message}>Loading tickets...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (tickets.length === 0)
    return <p className={styles.message}>No tickets submitted yet.</p>;

  return (
    <div className={styles.listContainer}>
      {" "}
      {/* <<< USE className */}
      <h2>Customer Tickets</h2>
      <ul className={styles.ul}>
        {" "}
        {/* <<< USE className */}
        {tickets.map((ticket) => (
          <li
            key={ticket._id}
            className={styles.li}
            onClick={() => onSelectTicket(ticket)}
          >
            {" "}
            {/* <<< USE className */}
            <div className={styles.ticketHeader}>
              {" "}
              {/* <<< USE className */}
              <strong>{ticket.subject}</strong>
              <span
                className={`${styles.priority} ${getPriorityClass(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>{" "}
              {/* <<< DYNAMIC CLASSES */}
            </div>
            <p className={styles.descriptionP}>
              {ticket.description.substring(0, 100)}...
            </p>{" "}
            {/* <<< USE className */}
            <small className={styles.date}>
              {" "}
              {/* <<< USE className */}
              Submitted by {ticket.user} on:{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </small>
            <span
              className={`${styles.status} ${getStatusClass(ticket.status)}`}
            >
              {ticket.status}
            </span>{" "}
            {/* <<< DYNAMIC CLASSES */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
