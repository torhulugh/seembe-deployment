import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? "navbar-link active" : "navbar-link";

  return (
    <header className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__brand" onClick={closeMenu}>
          Se-Embe
        </NavLink>

        <button
          type="button"
          className="navbar__toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "navbar__menu open" : "navbar__menu"}>
          <ul>
            <li>
              <NavLink to="/" className={getLinkClass} onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Events
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/celebrants"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Celebrants
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Profile
                  </NavLink>
                </li>
                {user?.role === "admin" && (
                  <li>
                    <NavLink
                      to="/admin/users"
                      className={getLinkClass}
                      onClick={closeMenu}
                    >
                      Admin
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout}>
                Sign out
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="navbar__button"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="navbar__button primary"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
