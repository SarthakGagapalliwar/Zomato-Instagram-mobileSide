import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";

const UserRegister = () => {

  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // directly get values from e.target
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = axios.post("http://localhost:3000/api/auth/user/register",{
      fullName,
      email,
      password
    },{
      withCredentials:true, //for handle the cookes from the backend
    })
    console.log((await response).data);
    
    navigate("/")
    

    // try {
    //   const response = await axios.post("http://localhost:5000/api/users/register", {
    //     fullName,
    //     email,
    //     password,
    //   });

    //   console.log("✅ User registered:", response.data);
    //   alert("Account created successfully!");
    //   e.target.reset(); // clear form
    // } catch (error) {
    //   console.error("❌ Registration failed:", error);
    //   alert(error.response?.data?.message || "Something went wrong");
    // }
  };

  return (
    <section className="auth-page">
      <article className="auth-card" aria-labelledby="user-register-heading">
        <header className="auth-header">
          <div className="auth-badge-set">
            <span className="auth-badge">User</span>
            <span className="auth-badge">Foodie</span>
          </div>
          <h1 id="user-register-heading">Create your user account</h1>
          <p>
            Join the community to save favourite dishes, re-order in a tap, and
            unlock personalised perks.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Full name</span>
            <input
              type="text"
              name="fullName"
              placeholder="Alex Morgan"
              autoComplete="name"
              required
            />
          </label>
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
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
            />
          </label>
          <button type="submit" className="auth-submit">
            Create account
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/user/login">Sign in instead</Link>
          </p>
          <p>
            Planning to list your restaurant?{" "}
            <Link to="/food-partner/register">Become a food partner</Link>
          </p>
        </footer>
      </article>
    </section>
  );
};

export default UserRegister;
