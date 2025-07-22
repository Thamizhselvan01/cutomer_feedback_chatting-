import React, { useEffect, useState } from "react";
import styles from "./TicketList.module.css";
import axiosInstance from "../api/axiosInstance"; // <--- ADD THIS LINE: Import your Axios instance

function TicketList({ refreshSignal, onSelectTicket }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- CHANGE THIS PART: Use axiosInstance.get() ---
      const response = await axiosInstance.get("/api/tickets");
      // Axios automatically appends '/api/tickets' to the baseURL configured in axiosInstance.js
      // Axios also automatically parses JSON, so you access data via response.data

      const data = response.data; // <--- Access the data directly here

      // No need for response.ok check with axios if you rely on interceptors for non-2xx responses
      setTickets(data);
      // --- END OF CHANGE ---
    } catch (err) {
      // --- CHANGE THIS PART: Improved error handling for Axios ---
      console.error(
        "Error fetching tickets:",
        err.response ? err.response.data : err.message
      );
      setError(
        `Error: ${
          err.response
            ? err.response.data.message || "Server error"
            : "Network Error: " + err.message
        }`
      );
      // --- END OF CHANGE ---
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
      <h2>Customer Tickets</h2>
      <ul className={styles.ul}>
        {tickets.map((ticket) => (
          <li
            key={ticket._id}
            className={styles.li}
            onClick={() => onSelectTicket(ticket)}
          >
            <div className={styles.ticketHeader}>
              <strong>{ticket.subject}</strong>
              <span
                className={`${styles.priority} ${getPriorityClass(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>
            </div>
            <p className={styles.descriptionP}>
              {ticket.description.substring(0, 100)}...
            </p>
            <small className={styles.date}>
              Submitted by {ticket.user} on:{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </small>
            <span
              className={`${styles.status} ${getStatusClass(ticket.status)}`}
            >
              {ticket.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
