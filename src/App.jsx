import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import EventFormPage from "./pages/EventFormPage";
import EventMessagesPage from "./pages/EventMessagesPage";
import CelebrantsPage from "./pages/CelebrantsPage";
import CelebrantFormPage from "./pages/CelebrantFormPage";
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";
import LogoutPage from "./pages/LogoutPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route
                path="/events/new"
                element={<EventFormPage mode="create" />}
              />
              <Route
                path="/events/:id/edit"
                element={<EventFormPage mode="edit" />}
              />
              <Route
                path="/events/:id/messages"
                element={<EventMessagesPage />}
              />
              <Route path="/celebrants" element={<CelebrantsPage />} />
              <Route
                path="/celebrants/new"
                element={<CelebrantFormPage mode="create" />}
              />
              <Route
                path="/celebrants/:id/edit"
                element={<CelebrantFormPage mode="edit" />}
              />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>
            Built with care for every celebration © {new Date().getFullYear()}{" "}
            Se-Embe
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
