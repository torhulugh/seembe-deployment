import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CelebrantsPage.css";

const CelebrantsPage = () => {
  const navigate = useNavigate();
  const [celebrants, setCelebrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCelebrants = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/celebrants");
      setCelebrants(data.celebrants || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load celebrants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCelebrants();
  }, []);

  const handleDelete = async (celebrantId) => {
    if (!window.confirm("Remove this celebrant and related events?")) {
      return;
    }

    try {
      await api.delete(`/celebrants/${celebrantId}`);
      await loadCelebrants();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete celebrant");
    }
  };

  return (
    <div className="celebrants">
      <header className="celebrants__header">
        <div>
          <h1>Celebrants</h1>
          <p>
            Keep heartfelt notes, favourite things, and milestones for the
            people you celebrate.
          </p>
        </div>
        <NavLink to="/celebrants/new" className="celebrants__create">
          + Add celebrant
        </NavLink>
      </header>

      {loading ? (
        <div className="page-loading">Loading celebrants...</div>
      ) : error ? (
        <div className="page-error">{error}</div>
      ) : celebrants.length === 0 ? (
        <div className="celebrants__empty">
          <p>No celebrants saved yet.</p>
          <NavLink to="/celebrants/new">Add your first celebrant</NavLink>
        </div>
      ) : (
        <div className="celebrants__grid">
          {celebrants.map((celebrant) => (
            <article key={celebrant._id} className="celebrants__card">
              <div className="celebrants__heading">
                <div>
                  <h2>{celebrant.name}</h2>
                  <span>{celebrant.relationship}</span>
                </div>
                {celebrant.photoUrl && (
                  <img src={celebrant.photoUrl} alt={celebrant.name} />
                )}
              </div>

              {celebrant.favouriteTags?.length > 0 && (
                <div className="celebrants__tags">
                  {celebrant.favouriteTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}

              {celebrant.keyDates?.length > 0 && (
                <ul className="celebrants__dates">
                  {celebrant.keyDates.map((date) => (
                    <li key={`${date.type}-${date.date}`}>
                      <strong>{date.type}</strong>
                      <span>
                        {new Date(date.date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                        })}
                        {date.recurring ? " • repeats" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {celebrant.notes && (
                <p className="celebrants__notes">{celebrant.notes}</p>
              )}

              <div className="celebrants__actions">
                <button
                  onClick={() => navigate(`/celebrants/${celebrant._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => handleDelete(celebrant._id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CelebrantsPage;
