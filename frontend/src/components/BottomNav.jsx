import { Link, useLocation } from "react-router-dom";
import "../styles/bottom-nav.css";

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>home</span>
      </Link>

      <Link
        to="/saved"
        className={`nav-item ${location.pathname === "/saved" ? "active" : ""}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>saved</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
