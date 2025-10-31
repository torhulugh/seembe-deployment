import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./CelebrantFormPage.css";

const createKeyDate = () => ({ type: "Birthday", date: "", recurring: true });

const CelebrantFormPage = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = mode === "edit";
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    photoUrl: "",
    favouriteTags: "",
    notes: "",
    keyDates: [createKeyDate()],
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const fetchCelebrant = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/celebrants/${id}`);
        const celebrant = data.celebrant;
        setFormData({
          name: celebrant.name,
          relationship: celebrant.relationship,
          photoUrl: celebrant.photoUrl || "",
          favouriteTags: celebrant.favouriteTags?.join(", ") || "",
          notes: celebrant.notes || "",
          keyDates:
            celebrant.keyDates?.length > 0
              ? celebrant.keyDates.map((date) => ({
                  type: date.type,
                  date: date.date?.slice(0, 10) || "",
                  recurring: Boolean(date.recurring),
                }))
              : [createKeyDate()],
        });
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load celebrant");
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrant();
  }, [id, isEditing]);

  const heading = useMemo(
    () => (isEditing ? "Update celebrant profile" : "Add a new celebrant"),
    [isEditing]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDateChange = (index, field, value) => {
    setFormData((prev) => {
      const nextDates = prev.keyDates.slice();
      nextDates[index] = { ...nextDates[index], [field]: value };
      return { ...prev, keyDates: nextDates };
    });
  };

  const addKeyDate = () => {
    setFormData((prev) => ({
      ...prev,
      keyDates: [...prev.keyDates, createKeyDate()],
    }));
  };

  const removeKeyDate = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyDates: prev.keyDates.filter((_, keyIndex) => keyIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: formData.name,
      relationship: formData.relationship,
      photoUrl: formData.photoUrl || undefined,
      favouriteTags: formData.favouriteTags
        ? formData.favouriteTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      notes: formData.notes,
      keyDates: formData.keyDates
        .filter((date) => date.date)
        .map((date) => ({
          type: date.type,
          date: new Date(date.date).toISOString(),
          recurring: Boolean(date.recurring),
        })),
    };

    try {
      if (isEditing) {
        await api.put(`/celebrants/${id}`, payload);
      } else {
        await api.post("/celebrants", payload);
      }
      navigate("/celebrants");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${isEditing ? "update" : "create"} celebrant`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="celebrant-form">
      <header>
        <h1>{heading}</h1>
        <p>
          {isEditing
            ? "Keep their preferences, key dates, and notes up to date."
            : "Store everything you need to deliver meaningful celebrations."}
        </p>
      </header>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-loading">Preparing celebrant profile...</div>
      ) : (
        <form className="celebrant-form__form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Relationship
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              placeholder="e.g. Sister, VIP Client"
              required
            />
          </label>

          <label>
            Photo URL (optional)
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://"
            />
          </label>

          <label>
            Favourite things / tags
            <input
              type="text"
              name="favouriteTags"
              value={formData.favouriteTags}
              onChange={handleChange}
              placeholder="Separate with commas"
            />
          </label>

          <div className="celebrant-form__dates">
            <div className="celebrant-form__dates-heading">
              <span>Key dates</span>
              <button type="button" onClick={addKeyDate}>
                + Add date
              </button>
            </div>
            {formData.keyDates.map((date, index) => (
              <div key={index} className="celebrant-form__date">
                <select
                  value={date.type}
                  onChange={(event) =>
                    handleKeyDateChange(index, "type", event.target.value)
                  }
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Naming Ceremony">Naming Ceremony</option>
                  <option value="Holiday">Holiday</option>
                </select>
                <input
                  type="date"
                  value={date.date}
                  onChange={(event) =>
                    handleKeyDateChange(index, "date", event.target.value)
                  }
                />
                <label className="celebrant-form__date-recurring">
                  <input
                    type="checkbox"
                    checked={date.recurring}
                    onChange={(event) =>
                      handleKeyDateChange(
                        index,
                        "recurring",
                        event.target.checked
                      )
                    }
                  />
                  Recurring
                </label>
                {formData.keyDates.length > 1 && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeKeyDate(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <label>
            Celebration notes
            <textarea
              name="notes"
              rows="4"
              placeholder="Gift ideas, favourite restaurants, conversation starters..."
              value={formData.notes}
              onChange={handleChange}
            />
          </label>

          <div className="celebrant-form__actions">
            <button
              type="button"
              className="ghost"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : isEditing
                ? "Save changes"
                : "Create celebrant"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CelebrantFormPage;
