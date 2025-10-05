import { useEffect, useState } from "react";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import "../styles/home.css";

const Saved = () => {
  const [savedVideos, setSavedVideos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", {
        withCredentials: true,
      })
      .then((response) => {
        const saved = response.data.foodItems.filter((item) => item.saved);
        setSavedVideos(saved);
      })
      .catch((error) => {
        console.error("Error fetching saved videos:", error);
      });
  }, []);

  return (
    <main className="reel-page">
      <section className="reel-feed">
        {savedVideos.length === 0 ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <p>No saved items yet</p>
          </div>
        ) : (
          savedVideos.map((reel) => (
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
                <button className="action-btn">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="action-text">
                    likes : {reel.likes || 23}
                  </span>
                </button>

                <button className="action-btn">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="action-text">Save : 24</span>
                </button>

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
                  <span className="action-text">
                    Comment:{reel.comments || 45}
                  </span>
                </button>
              </div>

              <div className="reel-overlay">
                <div className="reel-meta">
                  <p className="reel-description">{reel.description}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
      <BottomNav />
    </main>
  );
};

export default Saved;
