import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext.jsx";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [celebrants, setCelebrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, celebrantsResponse] = await Promise.all([
          api.get("/events"),
          api.get("/celebrants"),
        ]);

        setEvents(eventsResponse.data.events || []);
        setCelebrants(celebrantsResponse.data.celebrants || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const now = new Date();
  const sortedEvents = [...events].sort(
    (first, second) => new Date(first.date) - new Date(second.date)
  );
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.date) >= now
  );
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const pastEventsCount = events.length - upcomingEvents.length;

  let celebrantHighlight = null;
  let highestCount = 0;

  celebrants.forEach((celebrant) => {
    const count = events.filter((event) => {
      const celebrantId =
        typeof event.celebrant === "string"
          ? event.celebrant
          : event.celebrant?._id;
      return celebrantId === celebrant._id;
    }).length;

    if (count > highestCount) {
      highestCount = count;
      celebrantHighlight = { celebrant, count };
    }
  });

  if (highestCount === 0) {
    celebrantHighlight = null;
  }

  if (loading) {
    return <div className="page-loading">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>Hello, {user?.name || "there"}</h1>
          <p>
            Here is a summary of upcoming celebrations and the people you're
            planning for.
          </p>
        </div>
        <div className="dashboard__quick-actions">
          <NavLink to="/events/new" className="dashboard__action primary">
            + New event
          </NavLink>
          <NavLink to="/celebrants/new" className="dashboard__action ghost">
            + Add celebrant
          </NavLink>
        </div>
      </header>

      <section className="dashboard__metrics">
        <article>
          <span>Total events</span>
          <strong>{events.length}</strong>
        </article>
        <article>
          <span>Upcoming events</span>
          <strong>{upcomingEvents.length}</strong>
        </article>
        <article>
          <span>Past events</span>
          <strong>{pastEventsCount}</strong>
        </article>
        <article>
          <span>Celebrants</span>
          <strong>{celebrants.length}</strong>
        </article>
      </section>

      <section className="dashboard__grid">
        <div className="dashboard__panel">
          <div className="dashboard__panel-heading">
            <h2>Next celebration</h2>
            <NavLink to="/events">View all</NavLink>
          </div>
          {nextEvent ? (
            <div className="dashboard__event-card">
              <h3>{nextEvent.title}</h3>
              <span>
                {new Date(nextEvent.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <p>{nextEvent.status}</p>
              <NavLink
                to={`/events/${nextEvent._id}/messages`}
                className="dashboard__event-link"
              >
                Open preparation hub
              </NavLink>
            </div>
          ) : (
            <div className="dashboard__empty">
              <p>No upcoming events yet.</p>
              <NavLink to="/events/new">Schedule your first event</NavLink>
            </div>
          )}
        </div>

        <div className="dashboard__panel">
          <div className="dashboard__panel-heading">
            <h2>Celebrant spotlight</h2>
            <NavLink to="/celebrants">See directory</NavLink>
          </div>
          {celebrantHighlight ? (
            <div className="dashboard__celebrant-card">
              <h3>{celebrantHighlight.celebrant.name}</h3>
              <span>{celebrantHighlight.celebrant.relationship}</span>
              <p>
                {celebrantHighlight.count} scheduled event
                {celebrantHighlight.count === 1 ? "" : "s"}
              </p>
              <NavLink
                to={`/celebrants/${celebrantHighlight.celebrant._id}/edit`}
              >
                Update details
              </NavLink>
            </div>
          ) : (
            <div className="dashboard__empty">
              <p>No celebrants tracked yet.</p>
              <NavLink to="/celebrants/new">Add someone special</NavLink>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard__list">
        <div className="dashboard__panel">
          <div className="dashboard__panel-heading">
            <h2>Upcoming timeline</h2>
          </div>
          <ul className="dashboard__timeline">
            {events.length > 0 ? (
              sortedEvents.map((event) => (
                <li key={event._id}>
                  <div>
                    <span className="dashboard__timeline-date">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <h3>{event.title}</h3>
                    <p>{event.status || "upcoming"}</p>
                  </div>
                  <NavLink to={`/events/${event._id}/edit`}>Edit</NavLink>
                </li>
              ))
            ) : (
              <div className="dashboard__empty">
                <p>You have no events yet.</p>
              </div>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
