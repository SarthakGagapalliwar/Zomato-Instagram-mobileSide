import { NavLink } from "react-router-dom";
import "../styles/bottom-nav.css";

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  strokeWidth: 1.6,
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const HomeIcon = ({ active }) => (
  <svg
    {...iconProps}
    aria-hidden="true"
    stroke={active ? "currentColor" : "currentColor"}
    className={
      active ? "bottom-nav__icon bottom-nav__icon--active" : "bottom-nav__icon"
    }
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
  </svg>
);

const BookmarkIcon = ({ active }) => (
  <svg
    {...iconProps}
    aria-hidden="true"
    stroke={active ? "currentColor" : "currentColor"}
    className={
      active ? "bottom-nav__icon bottom-nav__icon--active" : "bottom-nav__icon"
    }
  >
    <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z" />
  </svg>
);

const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`
        }
      >
        {({ isActive }) => (
          <>
            <HomeIcon active={isActive} />
            <span className="bottom-nav__label">Home</span>
          </>
        )}
      </NavLink>
      <NavLink
        to="/saved"
        className={({ isActive }) =>
          `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`
        }
      >
        {({ isActive }) => (
          <>
            <BookmarkIcon active={isActive} />
            <span className="bottom-nav__label">Saved</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};

export default BottomNav;
