import { useEffect, useState } from "react";
import "../styles/home.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", {
        withCredentials: true,
      })
      .then((response) => {
        setVideo(response.data.foodItems);
      })
      .catch((error) => {
        console.error("Error fetching food data:", error);
      });
  }, []);

  return (
    <main className="reel-page">
      <section className="reel-feed" aria-label="Featured store videos">
        {video.map((reel) => (
          <article key={reel._id} className="reel-card">
            <video
              className="reel-video"
              // ref={setVideoRef(item._id)}
              src={reel.video}
              muted
              autoPlay
              playsInline
              loop
              preload="metadata"
            />
            <div className="reel-overlay">
              <div className="reel-meta">
                <p className="reel-description">{reel.description}</p>
                {reel.foodpartner && (
                  <Link
                    type="button"
                    className="reel-cta"
                    to={"/food-partner/" + reel.foodpartner}
                    aria-label="Visit store"
                  >
                    Visit store
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Home;
