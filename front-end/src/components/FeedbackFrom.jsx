import React, { useState } from "react";
import styles from "./FeedbackFrom.module.css"; // Corrected module name if it was FeedbackFrom.module.css

const FEEDBACK_API_URL = "http://localhost:5000/api/feedback";

function FeedbackForm({ onFeedbackSubmitted }) {
  // Renamed 'subject' to 'category' to match backend schema's required field
  // Initialize with a default category that is one of the enum values
  const [category, setCategory] = useState("General Inquiry");
  const [user, setUser] = useState("");
  const [messageText, setMessageText] = useState(""); // Correct state variable for message content
  const [rating, setRating] = useState("5"); // Default to 5
  const [responseMessage, setResponseMessage] = useState(null); // To display success/error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(null); // Clear previous messages

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // IMPORTANT: Ensure these match your backend FeedbackSchema
        // 'category' field is now sent, and 'message' uses 'messageText' state
        body: JSON.stringify({
          user,
          category, // Sending the new category state
          message: messageText, // Correctly using messageText state for the 'message' field
          rating: parseInt(rating),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage({
          type: "success",
          text: "Feedback submitted successfully!",
        });
        // Clear form fields after successful submission
        setCategory("General Inquiry"); // Reset to default category
        setUser("");
        setMessageText("");
        setRating("5");
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(); // Trigger refresh in FeedbackList
        }
      } else {
        // Display backend error message if available
        setResponseMessage({
          type: "error",
          text: data.message || "Failed to submit feedback.",
        });
      }
    } catch (err) {
      setResponseMessage({
        type: "error",
        text: `Network error: ${err.message}. Please try again.`,
      });
      console.error("Error submitting feedback:", err);
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
          </label>{" "}
          {/* Changed label for clarity */}
          <select
            id="category" // Changed ID to match category
            className={styles.select} // Using .select style for dropdown
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {/* Options based on your backend enum values */}
            <option value="General Inquiry">General Inquiry</option>
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user" className={styles.label}>
            Your Name/Email (Optional):
          </label>{" "}
          {/* User is not required based on schema */}
          <input
            type="text"
            id="user"
            className={styles.input}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            // Removed 'required' as per backend schema's 'required: false' for user
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message:
          </label>
          <textarea
            id="message"
            className={styles.textarea}
            value={messageText} // Use messageText for the value
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
            // Rating is not required as per schema, but having a default is fine
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
