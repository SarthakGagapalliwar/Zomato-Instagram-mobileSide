import { useEffect, useState } from "react";
import "../styles/home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const Home = () => {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", {
        withCredentials: true,
      })
      .then((response) => {
        const normalised = (response.data.foodItems ?? []).map((item) => ({
          likeCount: 0,
          savesCount: 0,
          liked: false,
          saved: false,
          ...item,
          likeCount: item.likeCount ?? 0,
          savesCount: item.savesCount ?? 0,
          liked: item.liked ?? false,
          saved: item.saved ?? false,
        }));
        setVideo(normalised);
      })
      .catch((error) => {
        console.error("Error fetching food data:", error);
      });
  }, []);

  async function handleLike(id) {
    const target = video.find((v) => v._id === id);
    const currentlyLiked = target?.liked ?? false;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: id },
        { withCredentials: true }
      );

      const { liked, likeCount } = response.data ?? {};
      const toggledLiked = liked ?? response.status === 201;
      const resolvedCount =
        likeCount ??
        Math.max(
          0,
          (target?.likeCount ?? 0) +
            (toggledLiked && !currentlyLiked
              ? 1
              : !toggledLiked && currentlyLiked
              ? -1
              : 0)
        );

      setVideo((prev) =>
        prev.map((v) =>
          v._id === id
            ? {
                ...v,
                likeCount: resolvedCount,
                liked: toggledLiked,
              }
            : v
        )
      );
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  }
  const handleSave = async (id) => {
    const target = video.find((v) => v._id === id);
    const currentlySaved = target?.saved ?? false;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: id },
        { withCredentials: true }
      );

      const { saved, savesCount } = response.data ?? {};
      const toggledSaved = saved ?? response.status === 201;
      const resolvedCount =
        savesCount ??
        Math.max(
          0,
          (target?.savesCount ?? 0) +
            (toggledSaved && !currentlySaved
              ? 1
              : !toggledSaved && currentlySaved
              ? -1
              : 0)
        );

      setVideo((prev) =>
        prev.map((v) =>
          v._id === id
            ? {
                ...v,
                savesCount: resolvedCount,
                saved: toggledSaved,
              }
            : v
        )
      );
    } catch (err) {
      console.error("Save toggle failed:", err);
    }
  };

  return (
    <main className="reel-page">
      <section className="reel-feed">
        {video.map((reel) => (
          <article key={reel._id} className="reel-card">
            <video
              className="reel-video"
              src={reel.video}
              muted
              autoPlay
              playsInline
              loop
              preload="metadata"
            />

            <div className="reel-actions">
              {/* ❤️ Like button */}
              <button
                className="action-btn"
                onClick={() => handleLike(reel._id)}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={reel.liked ? "#fff" : "none"}
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="action-text">{reel.likeCount}</span>
              </button>

              {/* 🔖 Save button */}
              <button
                className="action-btn"
                onClick={() => handleSave(reel._id)}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={reel.saved ? "#fff" : "none"}
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span className="action-text">{reel.savesCount}</span>
              </button>

              {/* 💬 Comments */}
              <button className="action-btn">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="action-text">{reel.comments ?? 0}</span>
              </button>
            </div>

            <div className="reel-overlay">
              <div className="reel-meta">
                <p className="reel-description">{reel.description}</p>
                {reel.foodpartner && (
                  <Link
                    className="reel-cta"
                    to={"/food-partner/" + reel.foodpartner}
                  >
                    visit store
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
      <BottomNav />
    </main>
  );
};

export default Home;
