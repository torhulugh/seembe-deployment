import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./EventFormPage.css";

const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
};

const EventFormPage = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = mode === "edit";

  const [celebrants, setCelebrants] = useState([]);
  const [loading, setLoading] = useState(!isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    celebrant: "",
    status: "upcoming",
    reminderDays: 3,
    notes: "",
  });

  useEffect(() => {
    const fetchCelebrants = async () => {
      try {
        const { data } = await api.get("/celebrants");
        setCelebrants(data.celebrants || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load celebrants");
      }
    };
    fetchCelebrants();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/events/${id}`);
        const event = data.event;
        setFormData({
          title: event.title,
          date: toInputDateTime(event.date),
          celebrant:
            typeof event.celebrant === "string"
              ? event.celebrant
              : event.celebrant?._id || "",
          status: event.status || "upcoming",
          reminderDays: event.reminderSettings?.daysBefore || 3,
          notes: event.reminderSettings?.notes || "",
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isEditing]);

  const heading = useMemo(
    () => (isEditing ? "Update event details" : "Create a new event"),
    [isEditing]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: formData.title,
      date: new Date(formData.date).toISOString(),
      celebrant: formData.celebrant,
      status: formData.status,
      reminderSettings: {
        daysBefore: Number(formData.reminderDays),
        notes: formData.notes,
      },
    };

    try {
      if (isEditing) {
        await api.put(`/events/${id}`, payload);
      } else {
        await api.post("/events", payload);
      }
      navigate("/events");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${isEditing ? "update" : "create"} event`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="event-form">
      <header>
        <h1>{heading}</h1>
        <p>
          {isEditing
            ? "Adjust details, schedules, or reminder preferences."
            : "Connect an event to a celebrant and decide when to be reminded."}
        </p>
      </header>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-loading">Preparing form...</div>
      ) : (
        <form className="event-form__form" onSubmit={handleSubmit}>
          <label>
            Event title
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mom's 60th Birthday"
              required
            />
          </label>

          <label>
            Date &amp; time
            <input
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Celebrant
            <select
              name="celebrant"
              value={formData.celebrant}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select celebrant
              </option>
              {celebrants.map((celebrant) => (
                <option key={celebrant._id} value={celebrant._id}>
                  {celebrant.name} — {celebrant.relationship}
                </option>
              ))}
            </select>
          </label>

          <label>
            Reminder (days before)
            <input
              name="reminderDays"
              type="number"
              min="0"
              max="30"
              value={formData.reminderDays}
              onChange={handleChange}
            />
          </label>

          <label>
            Notes for reminder
            <textarea
              name="notes"
              rows="4"
              placeholder="Gift ideas, tasks, message prompts..."
              value={formData.notes}
              onChange={handleChange}
            />
          </label>

          {isEditing && (
            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          )}

          <div className="event-form__actions">
            <button
              type="button"
              className="ghost"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Save changes" : "Create event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventFormPage;

