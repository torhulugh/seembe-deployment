import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext.jsx";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, refreshUser, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      const { data } = await api.put("/users/me", payload);
      setUser(data.user);
      setMessage("Profile updated successfully");
      refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile">
      <header>
        <h1>Your profile</h1>
        <p>Keep your Se-Embe account details up to date.</p>
      </header>

      <section className="profile__card">
        <div className="profile__overview">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className="profile__role">Role: {user?.role}</span>
        </div>

        <form className="profile__form" onSubmit={handleSubmit}>
          {message && <div className="profile__success">{message}</div>}
          {error && <div className="profile__error">{error}</div>}

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
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
