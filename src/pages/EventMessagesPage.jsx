import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext.jsx";
import "./EventMessagesPage.css";

const EventMessagesPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const [{ data: eventData }, { data: messagesData }] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/messages/event/${id}`),
      ]);
      setEvent(eventData.event);
      setMessages(messagesData.messages || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load event messages");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (eventSubmission) => {
    eventSubmission.preventDefault();
    if (!messageContent.trim()) return;
    setSubmitting(true);

    try {
      await api.post(`/messages/event/${id}`, { content: messageContent });
      setMessageContent("");
      await loadMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Delete this note?")) {
      return;
    }

    try {
      await api.delete(`/messages/${messageId}`);
      await loadMessages();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete message");
    }
  };

  if (loading) {
    return <div className="page-loading">Loading message hub...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="messages">
      <header className="messages__header">
        <div>
          <h1>Message hub: {event?.title}</h1>
          <p>
            Capture ideas, checklists, and notes for this celebration. Share
            updates with collaborators easily.
          </p>
        </div>
        <div className="messages__meta">
          <span>
            {new Date(event?.date).toLocaleString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>Status: {event?.status}</span>
        </div>
      </header>

      <section className="messages__composer">
        <form onSubmit={handleSubmit}>
          <textarea
            rows="4"
            placeholder="Add a note, to-do, or message template..."
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post message"}
          </button>
        </form>
      </section>

      <section className="messages__list">
        {messages.length === 0 ? (
          <div className="messages__empty">
            <p>No notes yet. Kick off the planning with your first message.</p>
          </div>
        ) : (
          messages
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((message) => {
              const authorId =
                typeof message.user === "string"
                  ? message.user
                  : message.user?._id;
              const canDelete = authorId === user?._id;

              return (
                <article key={message._id} className="messages__card">
                  <header>
                    <span>
                      {new Date(message.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {canDelete && (
                      <button onClick={() => handleDelete(message._id)}>
                        Delete
                      </button>
                    )}
                  </header>
                  <p>{message.content}</p>
                </article>
              );
            })
        )}
      </section>
    </div>
  );
};

export default EventMessagesPage;
