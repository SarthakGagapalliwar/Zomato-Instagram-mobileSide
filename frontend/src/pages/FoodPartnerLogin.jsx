import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login success:", response.data);
      setError("");
      e.target.reset();

      // redirect to dashboard after login
      navigate("/create-food");
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("Invalid credentials or server error. Please try again.");
    }
  };

  return (
    <section className="auth-page">
      <article
        className="auth-card"
        aria-labelledby="food-partner-login-heading"
      >
        <header className="auth-header">
          <div className="auth-badge-set">
            <span className="auth-badge">Food partner</span>
          </div>
          <h1 id="food-partner-login-heading">Partner dashboard access</h1>
          <p>
            Manage menus, monitor live orders, and view performance insights in
            seconds.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Business email</span>
            <input
              type="email"
              name="email"
              placeholder="kitchen@yourbrand.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="auth-submit">
            Access dashboard
          </button>

          {/* Show error if login fails */}
          {error && <p className="auth-error">{error}</p>}
        </form>

        <footer className="auth-footer">
          <p>
            New to our platform?{" "}
            <Link to="/food-partner/register">Register as a food partner</Link>
          </p>
          <p>
            Looking to order food? <Link to="/user/login">Login as a user</Link>
          </p>
        </footer>
      </article>
    </section>
  );
};

export default FoodPartnerLogin;
