import { NavLink } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for might have been moved or removed.</p>
      <NavLink to="/" className="not-found__button">
        Return home
      </NavLink>
    </div>
  );
};

export default NotFoundPage;
