import React, { useState } from 'react'; // Make sure useState is imported!
import styles from './TicketFrom.module.css';


const TICKET_API_URL = 'http://localhost:5000/api/tickets';

function TicketForm({ onTicketCreated }) {
  // <<< CHECK THESE LINES CAREFULLY >>>
  const [subject, setSubject] = useState('');
  const [user, setUser] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [message, setMessage] = useState(null); // For success/error messages
  // <<< END CHECK >>>

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    try {
      const response = await fetch(TICKET_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, user, description, priority }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Ticket submitted successfully!' });
        setSubject('');
        setUser('');
        setDescription('');
        setPriority('Low');
        if (onTicketCreated) {
          onTicketCreated(); // Trigger refresh in TicketList
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit ticket.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Network error: ${err.message}. Please try again.` });
      console.error('Error submitting ticket:', err);
    }
  };

  return (
    <div className={styles.formContainer}> {/* <<< Use className */}
      <h2 className={styles.formTitle}>Submit a New Ticket</h2> {/* <<< Use className */}

      {message && (
        <p className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}> {/* <<< Use className */}
          <label htmlFor="subject" className={styles.label}>Subject:</label> {/* <<< Use className */}
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
          <label htmlFor="user" className={styles.label}>Your Name/Email:</label>
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
          <label htmlFor="description" className={styles.label}>Description:</label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority" className={styles.label}>Priority:</label>
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

        <button type="submit" className={styles.submitButton}>Submit Ticket</button> {/* <<< Use className */}
      </form>
    </div>
  );
}

export default TicketForm;
