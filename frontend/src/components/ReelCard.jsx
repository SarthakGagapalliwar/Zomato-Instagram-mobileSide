import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSaved } from "../context/SavedContext.jsx";

const HeartIcon = ({ filled }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={
      filled ? "reel-action-icon reel-action-icon--filled" : "reel-action-icon"
    }
  >
    <path
      d="M12 21s-5.45-3.39-8.15-7C1.78 10.69 2.14 6.53 5.2 5.1A4.2 4.2 0 0 1 12 7.14 4.2 4.2 0 0 1 18.8 5.1c3.06 1.43 3.42 5.59 1.35 8.9C17.45 17.61 12 21 12 21z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookmarkIcon = ({ active }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={
      active ? "reel-action-icon reel-action-icon--filled" : "reel-action-icon"
    }
  >
    <path
      d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="reel-action-icon"
  >
    <path
      d="M21 12.5a7.5 7.5 0 0 1-7.5 7.5H9l-4 3v-3a7.5 7.5 0 1 1 16-7.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const extractMetric = (item, keys, fallback = 0) => {
  for (const key of keys) {
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      if (item?.[parent]?.[child] !== undefined) {
        return Number(item[parent][child]) || 0;
      }
    } else if (item?.[key] !== undefined) {
      return Number(item[key]) || 0;
    }
  }
  return fallback;
};

const ReelCard = ({ reel }) => {
  const { toggleSave, isSaved } = useSaved();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(() =>
    extractMetric(reel, ["likes", "likesCount", "metrics.likes"])
  );

  useEffect(() => {
    setLiked(false);
    setLikesCount(
      extractMetric(reel, ["likes", "likesCount", "metrics.likes"])
    );
  }, [reel?._id]);

  const saved = isSaved(reel?._id);

  const baseSaves = useMemo(
    () => extractMetric(reel, ["saves", "saveCount", "metrics.saves"]),
    [reel]
  );
  const comments = useMemo(
    () => extractMetric(reel, ["comments", "commentCount", "metrics.comments"]),
    [reel]
  );

  const handleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((count) => {
        const updated = count + (next ? 1 : -1);
        return updated < 0 ? 0 : updated;
      });
      return next;
    });
  };

  const handleSave = () => {
    toggleSave(reel);
  };

  const metrics = useMemo(
    () => ({
      likes: likesCount,
      saves: baseSaves + (saved ? 1 : 0),
      comments,
    }),
    [likesCount, baseSaves, saved, comments]
  );

  const description = reel?.description || "No description provided yet.";
  const title = reel?.title || "Video";

  return (
    <article className="reel-card">
      {reel?.video ? (
        <video
          className="reel-video"
          src={reel.video}
          muted
          autoPlay
          playsInline
          loop
          preload="metadata"
          aria-label={`${title} preview`}
        />
      ) : (
        <div className="reel-placeholder" aria-label="Video placeholder">
          {title}
        </div>
      )}

      <div className="reel-overlay">
        <header className="reel-header">
          <span className="reel-title">{title}</span>
        </header>

        <div className="reel-body">
          <div className="reel-meta">
            <p className="reel-description">{description}</p>
            {reel?.foodpartner && (
              <Link
                to={`/food-partner/${reel.foodpartner}`}
                className="reel-cta"
              >
                Visit store
              </Link>
            )}
          </div>

          <div className="reel-actions" aria-label="Video quick actions">
            <button
              type="button"
              className={`reel-action-btn${
                liked ? " reel-action-btn--active" : ""
              }`}
              onClick={handleLike}
            >
              <HeartIcon filled={liked} />
              <span className="reel-action-label"> {metrics.likes}</span>
            </button>

            <button
              type="button"
              className={`reel-action-btn${
                saved ? " reel-action-btn--active" : ""
              }`}
              onClick={handleSave}
            >
              <BookmarkIcon active={saved} />
              <span className="reel-action-label">{metrics.saves}</span>
            </button>

            <div
              className="reel-action-btn reel-action-btn--static"
              role="status"
              aria-live="polite"
            >
              <CommentIcon />
              <span className="reel-action-label">
                 {metrics.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReelCard;
