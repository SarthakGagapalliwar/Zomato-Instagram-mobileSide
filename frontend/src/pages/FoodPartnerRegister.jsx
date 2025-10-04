import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // grab values from form
    const restaurantName = e.target.restaurantName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register",
        {
          name: restaurantName,
          contactName,
          phone,
          address,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("✅ Food partner registered:", response.data);
      e.target.reset();
      navigate("/create-food");
    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="auth-page">
      <article
        className="auth-card"
        aria-labelledby="food-partner-register-heading"
      >
        <header className="auth-header">
          <div className="auth-badge-set">
            <span className="auth-badge">Food partner</span>
            <span className="auth-badge">Grow with us</span>
          </div>
          <h1 id="food-partner-register-heading">Become a food partner</h1>
          <p>
            List your menu, access delivery logistics, and reach new customers
            without the paperwork.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Restaurant name */}
          <label className="auth-field">
            <span>Restaurant name</span>
            <input
              type="text"
              name="restaurantName"
              placeholder="The Midnight Kitchen"
              required
            />
          </label>

          {/* Contact person name */}
          <label className="auth-field">
            <span>Contact person</span>
            <input
              type="text"
              name="contactName"
              placeholder="John Doe"
              required
            />
          </label>

          {/* Phone number */}
          <label className="auth-field">
            <span>Phone number</span>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              pattern="[0-9]{10,15}"
              required
            />
          </label>

          {/* Address */}
          <label className="auth-field">
            <span>Business address</span>
            <input
              type="text"
              name="address"
              placeholder="123 Main Street, City"
              required
            />
          </label>

          {/* Business email */}
          <label className="auth-field">
            <span>Business email</span>
            <input
              type="email"
              name="email"
              placeholder="hello@restaurant.com"
              autoComplete="email"
              required
            />
          </label>

          {/* Password */}
          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a secure password"
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="auth-submit">
            Begin onboarding
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Already partnered with us?{" "}
            <Link to="/food-partner/login">Access your dashboard</Link>
          </p>
          <p>
            Want to place orders instead?{" "}
            <Link to="/user/register">Create a user account</Link>
          </p>
        </footer>
      </article>
    </section>
  );
};

export default FoodPartnerRegister;
