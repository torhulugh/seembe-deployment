import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminUsersPage.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      setUsers(data.users || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}`, { role });
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete user");
    }
  };

  return (
    <div className="admin-users">
      <header>
        <h1>Team management</h1>
        <p>Review members and update their roles whenever you need to.</p>
      </header>

      <section className="admin-users__list">
        <h2>Existing members</h2>
        {loading ? (
          <div className="page-loading">Loading users...</div>
        ) : error ? (
          <div className="page-error">{error}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((member) => (
                <tr key={member._id}>
                  <td data-label="Name">{member.name}</td>
                  <td data-label="Email">{member.email}</td>
                  <td data-label="Role">
                    <select
                      value={member.role}
                      onChange={(event) =>
                        handleRoleChange(member._id, event.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td data-label="Joined">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Actions">
                    <button onClick={() => handleDelete(member._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminUsersPage;
