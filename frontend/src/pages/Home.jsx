import { useEffect, useState } from "react";
import axios from "axios";
import ReelCard from "../components/ReelCard.jsx";
import BottomNav from "../components/BottomNav.jsx";
import "../styles/home.css";

const fallbackReels = [
  {
    _id: "demo-1",
    title: "Video",
    description:
      "Discover today’s seasonal menu crafted by our favourite partner chefs.",
    video: "",
    likes: 23,
    saves: 23,
    comments: 45,
    foodpartner: "demo-store",
  },
  {
    _id: "demo-2",
    title: "Video",
    description:
      "Experience a new street-food inspired special with same-day delivery.",
    video: "",
    likes: 18,
    saves: 12,
    comments: 31,
    foodpartner: "demo-store",
  },
];

const Home = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchReels = async () => {
      setIsLoading(true);
      setError(null);
      setUsedFallback(false);

      try {
        const response = await axios.get("http://localhost:3000/api/food", {
          withCredentials: true,
        });

        if (!isMounted) return;

        const items = response?.data?.foodItems ?? [];
        if (items.length === 0) {
          setReels(fallbackReels);
          setUsedFallback(true);
        } else {
          setReels(items);
        }
      } catch (requestError) {
        if (!isMounted) return;
        console.error("Error fetching food data:", requestError);
        setError(
          "We couldn’t reach the server, showing a preview feed instead."
        );
        setReels(fallbackReels);
        setUsedFallback(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReels();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="reel-page">
      <section className="reel-feed" aria-label="Featured store videos">
        {isLoading ? (
          <div className="reel-empty">
            <div>
              <h2>Loading your personalised feed…</h2>
              <p>We’re fetching the latest drops from partner kitchens.</p>
            </div>
          </div>
        ) : reels.length ? (
          reels.map((reel, index) => (
            <ReelCard key={reel?._id ?? `reel-${index}`} reel={reel} />
          ))
        ) : (
          <div className="reel-empty">
            <div>
              <h2>No videos yet</h2>
              <p>Check back later or explore your saved stores below.</p>
            </div>
          </div>
        )}
      </section>

      {(error || usedFallback) && !isLoading && (
        <div className="reel-hint" role="status">
          {error || "Showing sample content until new drops arrive."}
        </div>
      )}

      <BottomNav />
    </main>
  );
};

export default Home;
