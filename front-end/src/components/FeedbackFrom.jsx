// src/components/FeedbackForm.jsx
import React, { useState } from "react";
import styles from "./FeedbackFrom.module.css"; // Corrected module name if it was FeedbackFrom.module.css
import axiosInstance from "../api/axiosInstance"; // <--- KEEP THIS IMPORT!

// REMOVE THIS LINE:
// const FEEDBACK_API_URL = "http://localhost:5000/api/feedback";

function FeedbackForm({ onNewFeedback }) {
  // Changed prop name to match your App.jsx: onNewFeedback
  const [category, setCategory] = useState("General Inquiry");
  const [user, setUser] = useState("");
  const [messageText, setMessageText] = useState("");
  const [rating, setRating] = useState("5");
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(null);

    // Prepare the data object to send
    // Ensure these field names (user, category, message, rating) match your backend's FeedbackSchema
    const formData = {
      user,
      category,
      message: messageText, // 'message' field in backend expects 'messageText' from state
      rating: parseInt(rating), // Ensure rating is an integer if your schema expects it
    };

    try {
      // --- CHANGE THIS PART: Use axiosInstance.post() ---
      // Axios automatically handles method, headers (for JSON), and JSON.stringify(body)
      const response = await axiosInstance.post("/api/feedback", formData);

      // Axios automatically parses JSON and puts it in .data
      const data = response.data;
      // --- END OF CHANGE ---

      setResponseMessage({
        type: "success",
        text: "Feedback submitted successfully!",
      }); // Clear form fields after successful submission
      setCategory("General Inquiry");
      setUser("");
      setMessageText("");
      setRating("5");

      // onNewFeedback will receive the response data, as passed from App.jsx
      if (onNewFeedback) {
        // Use onNewFeedback here, as passed from App.jsx
        onNewFeedback(data); // Pass the data from the successful response
      }
    } catch (err) {
      // --- CHANGE THIS PART: Improved error handling for Axios ---
      console.error(
        "Error submitting feedback:",
        err.response ? err.response.data : err.message
      );
      setResponseMessage({
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
      <h2 className={styles.formTitle}>Submit General Feedback</h2>
      {responseMessage && (
        <p
          className={
            responseMessage.type === "success"
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {responseMessage.text}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Category:
          </label>
          <select
            id="category"
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="user" className={styles.label}>
            Your Name/Email (Optional):
          </label>
          <input
            type="text"
            id="user"
            className={styles.input}
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message:
          </label>
          <textarea
            id="message"
            className={styles.textarea}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            Rating (1-5):
          </label>
          <select
            id="rating"
            className={styles.select}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
