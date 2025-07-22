// src/components/TicketForm.jsx
import React, { useState } from "react";
import styles from "./TicketFrom.module.css";
import axiosInstance from "../api/axiosInstance"; // <--- Keep this import!

// REMOVE THIS LINE:
// const TICKET_API_URL = 'http://localhost:5000/api/tickets';

function TicketForm({ onNewTicket }) {
  // Changed prop name to match your App.jsx: onNewTicket
  const [subject, setSubject] = useState("");
  const [user, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [message, setMessage] = useState(null); // For success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    // Prepare the data to send
    const formData = { subject, user, description, priority };

    try {
      // --- CHANGE THIS PART: Use axiosInstance.post() ---
      // Axios automatically handles method, headers (for JSON), and JSON.stringify(body)
      const response = await axiosInstance.post("/api/tickets", formData);

      // Axios automatically parses JSON and puts it in .data
      const data = response.data;
      // --- END OF CHANGE ---

      setMessage({ type: "success", text: "Ticket submitted successfully!" });
      setSubject("");
      setUser("");
      setDescription("");
      setPriority("Low");

      // onNewTicket will receive the response data, similar to how you were using onTicketCreated
      if (onNewTicket) {
        // Use onNewTicket here, as passed from App.jsx
        onNewTicket(data); // Pass the data from the successful response
      }
    } catch (err) {
      // --- CHANGE THIS PART: Improved error handling for Axios ---
      console.error(
        "Error submitting ticket:",
        err.response ? err.response.data : err.message
      );
      setMessage({
        type: "error",
        text: `Error: ${
          err.response
            ? err.response.data.message || "Server error"
            : "Network error: " + err.message
        }. Please try again.`,
      });
      // --- END OF CHANGE ---
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Submit a New Ticket</h2>

      {message && (
        <p
          className={
            message.type === "success"
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            className={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user" className={styles.label}>
            Your Name/Email:
          </label>
          <input
            type="text"
            id="user"
            className={styles.input}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description:
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority" className={styles.label}>
            Priority:
          </label>
          <select
            id="priority"
            className={styles.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

export default TicketForm;
