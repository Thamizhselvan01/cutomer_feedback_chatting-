import React, { useEffect, useState } from "react";
import styles from "./FeedBacklist.module.css";
import axiosInstance from "../api/axiosInstance"; // <--- ADD THIS LINE: Import your Axios instance

function FeedbackList({ refreshSignal }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      // --- CHANGE THIS PART: Use axiosInstance.get() ---
      const response = await axiosInstance.get("/api/feedback");
      // Axios automatically appends '/api/feedback' to the baseURL configured in axiosInstance.js
      // Axios also automatically parses JSON, so you access data via response.data

      const data = response.data; // <--- Access the data directly here

      // No need for response.ok check with axios if you rely on interceptors for non-2xx responses
      setFeedback(data);
      // --- END OF CHANGE ---
    } catch (err) {
      // --- CHANGE THIS PART: Improved error handling for Axios ---
      console.error(
        "Error fetching feedback:",
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
    fetchFeedback();
  }, [refreshSignal]);

  if (loading) return <p className={styles.message}>Loading feedback...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (feedback.length === 0)
    return <p className={styles.message}>No feedback submitted yet.</p>;

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>Customer Feedback</h2>
      <ul className={styles.ul}>
        {feedback.map((item) => (
          <li key={item._id} className={styles.li}>
            <div className={styles.feedbackHeader}>
              <strong className={styles.subject}>{item.subject}</strong>
              <span className={styles.rating}>Rating: {item.rating}/5</span>
            </div>
            <p className={styles.messageP}>{item.message}</p>
            <small className={styles.userDate}>
              Submitted by {item.user} on:{" "}
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeedbackList;
