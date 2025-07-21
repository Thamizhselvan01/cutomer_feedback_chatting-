import React, { useEffect, useState } from "react";
import styles from "./FeedBacklist.module.css";

const FEEDBACK_API_URL = "http://localhost:5000/api/feedback";


function FeedbackList({ refreshSignal }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(FEEDBACK_API_URL);
      const data = await response.json();

      if (response.ok) {
        setFeedback(data);
      } else {
        setError(data.message || "Failed to fetch feedback.");
      }
    } catch (err) {
      setError(`Network Error: ${err.message}. Is backend running?`);
      console.error("Error fetching feedback:", err);
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
      {" "}
      {/* <<< Use className */}
      <h2 className={styles.listTitle}>Customer Feedback</h2>{" "}
      {/* <<< Use className */}
      <ul className={styles.ul}>
        {" "}
        {/* <<< Use className */}
        {feedback.map((item) => (
          <li key={item._id} className={styles.li}>
            {" "}
            {/* <<< Use className */}
            <div className={styles.feedbackHeader}>
              {" "}
              {/* <<< Use className */}
              <strong className={styles.subject}>{item.subject}</strong>{" "}
              {/* <<< Use className */}
              <span className={styles.rating}>
                Rating: {item.rating}/5
              </span>{" "}
              {/* <<< Use className */}
            </div>
            <p className={styles.messageP}>{item.message}</p>{" "}
            {/* <<< Use className */}
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
