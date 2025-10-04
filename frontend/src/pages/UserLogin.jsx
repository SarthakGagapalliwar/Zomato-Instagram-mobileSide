import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await axios.post(
        "http://localhost:3000/api/auth/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // handle cookies from the backend
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Unable to log in");
    }
  };

  return (
    <section className="auth-page">
      <article className="auth-card" aria-labelledby="user-login-heading">
        <header className="auth-header">
          <div className="auth-badge-set">
            <span className="auth-badge">User</span>
          </div>
          <h1 id="user-login-heading">Welcome back</h1>
          <p>
            Sign in to track your orders, manage subscriptions, and discover new
            favourites.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
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
            Sign in
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            New to the platform?{" "}
            <Link to="/user/register">Create a user account</Link>
          </p>
          <p>
            Are you a food partner?{" "}
            <Link to="/food-partner/login">Login here</Link>
          </p>
        </footer>
      </article>
    </section>
  );
};

export default UserLogin;
