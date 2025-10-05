import ReelCard from "../components/ReelCard.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useSaved } from "../context/SavedContext.jsx";
import "../styles/home.css";

const Saved = () => {
  const { savedList } = useSaved();
  const hasSaved = savedList.length > 0;

  return (
    <main className="reel-page">
      <section className="reel-feed" aria-label="Saved store videos">
        {hasSaved ? (
          savedList.map((item) => <ReelCard key={item._id} reel={item} />)
        ) : (
          <div className="reel-empty">
            <div>
              <h2>Your saved videos live here</h2>
              <p>
                Tap the bookmark icon on any video to add it to this list and
                watch it again later.
              </p>
            </div>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
};

export default Saved;
