import { NavLink } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import "./HomePage.css";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <span className="home__eyebrow">Celebrations made simple</span>
          <h1>
            Stay ahead of every
            <span> special moment</span>
          </h1>
          <p>
            Seembe helps you keep track of the people you love, plan thoughtful
            gestures, and send timely reminders so you never miss a celebration
            again.
          </p>
          <div className="home__cta">
            {isAuthenticated ? (
              <NavLink to="/dashboard" className="home__button primary">
                Go to dashboard
              </NavLink>
            ) : (
              <>
                <NavLink to="/register" className="home__button primary">
                  Get started free
                </NavLink>
                <NavLink to="/login" className="home__button ghost">
                  I already have an account
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div className="home__hero-card">
          <div className="home__stats">
            <h3>Automated reminders</h3>
            <p>Customize how and when you want to be notified for each event.</p>
          </div>
          <div className="home__stats">
            <h3>Personal profiles</h3>
            <p>Store favourite gifts, notes, and past celebrations in one place.</p>
          </div>
          <div className="home__stats">
            <h3>Smart planning</h3>
            <p>Create checklists and message templates to celebrate with ease.</p>
          </div>
        </div>
      </section>

      <section className="home__features">
        <h2>Everything you need to celebrate thoughtfully</h2>
        <div className="home__feature-grid">
          <article>
            <h3>Organize your celebrants</h3>
            <p>
              Build detailed profiles for family, friends, and clients including
              relationship notes, favourite things, and key milestones.
            </p>
          </article>
          <article>
            <h3>Plan memorable events</h3>
            <p>
              Schedule birthdays, anniversaries, or cultural moments and track
              preparation tasks from one intuitive dashboard.
            </p>
          </article>
          <article>
            <h3>Stay connected</h3>
            <p>
              Use messaging templates and reminders to send warm wishes exactly
              when they matter most.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

