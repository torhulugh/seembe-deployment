import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./EventsPage.css";

const statusLabels = {
  upcoming: "Upcoming",
  past: "Completed",
  cancelled: "Cancelled",
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [celebrants, setCelebrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    celebrant: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, celebrantsResponse] = await Promise.all([
        api.get("/events"),
        api.get("/celebrants"),
      ]);
      setEvents(eventsResponse.data.events || []);
      setCelebrants(celebrantsResponse.data.celebrants || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const celebrantId =
      typeof event.celebrant === "string"
        ? event.celebrant
        : event.celebrant?._id;

    const matchesQuery = filters.query
      ? event.title.toLowerCase().includes(filters.query.toLowerCase())
      : true;
    const matchesStatus = filters.status
      ? event.status === filters.status
      : true;
    const matchesCelebrant = filters.celebrant
      ? celebrantId === filters.celebrant
      : true;

    return matchesQuery && matchesStatus && matchesCelebrant;
  });

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete event");
    }
  };

  const handleStatusUpdate = async (eventId, status) => {
    try {
      await api.put(`/events/${eventId}`, { status });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update event");
    }
  };

  return (
    <div className="events">
      <header className="events__header">
        <div>
          <h1>Events</h1>
          <p>Manage celebrations, reminders, and preparation tasks.</p>
        </div>
        <NavLink to="/events/new" className="events__create">
          + Schedule event
        </NavLink>
      </header>

      <section className="events__filters">
        <input
          type="search"
          placeholder="Search events"
          value={filters.query}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, query: event.target.value }))
          }
        />
        <select
          value={filters.status}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, status: event.target.value }))
          }
        >
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filters.celebrant}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, celebrant: event.target.value }))
          }
        >
          <option value="">All celebrants</option>
          {celebrants.map((celebrant) => (
            <option key={celebrant._id} value={celebrant._id}>
              {celebrant.name}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <div className="page-loading">Loading events...</div>
      ) : error ? (
        <div className="page-error">{error}</div>
      ) : (
        <div className="events__grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const celebrantName =
                typeof event.celebrant === "object" && event.celebrant
                  ? event.celebrant.name
                  : celebrants.find((item) => item._id === event.celebrant)
                      ?.name;

              return (
                <article key={event._id} className="events__card">
                  <div
                    className={`events__status events__status--${event.status}`}
                  >
                    {statusLabels[event.status] || event.status}
                  </div>
                  <h2>{event.title}</h2>
                  <p className="events__date">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="events__celebrant">
                    Celebrant: {celebrantName || "Not linked"}
                  </p>
                  {event.reminderSettings && (
                    <p className="events__meta">
                      Reminder: {JSON.stringify(event.reminderSettings)}
                    </p>
                  )}

                  <div className="events__actions">
                    <button
                      onClick={() => navigate(`/events/${event._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/events/${event._id}/messages`)}
                    >
                      Messages
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="events__status-toggle">
                    <label htmlFor={`status-${event._id}`}>Update status</label>
                    <select
                      id={`status-${event._id}`}
                      value={event.status}
                      onChange={(evt) =>
                        handleStatusUpdate(event._id, evt.target.value)
                      }
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="events__empty">
              <p>
                No events found. Try adjusting your filters or create a new one.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
