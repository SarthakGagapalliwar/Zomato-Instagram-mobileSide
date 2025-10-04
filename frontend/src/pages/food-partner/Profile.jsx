import React, { useEffect, useState } from "react";
import "../../styles/profile-mobile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [video, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [videoErrors, setVideoErrors] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, [id]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="profile-avatar">
          <img className="avatar-circle" 
          src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
          />
            
        </div>
        <div className="profile-title">
          <h1 className="business-name">{profile.name}</h1>
          <p className="business-type">Food Partner</p>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="contact-card">
        <h3 className="card-title">Contact Information</h3>
        <div className="contact-list">
          <div className="contact-item">
            <span className="contact-icon">👤</span>
            <div className="contact-details">
              <span className="contact-label">Contact Person</span>
              <span className="contact-value">{profile.contactName}</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div className="contact-details">
              <span className="contact-label">Phone</span>
              <span className="contact-value">{profile.phone}</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div className="contact-details">
              <span className="contact-label">Email</span>
              <span className="contact-value">{profile.email}</span>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div className="contact-details">
              <span className="contact-label">Address</span>
              <span className="contact-value">{profile.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="stats-card">
        <h3 className="card-title">Business Stats</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-number">{video.length}</div>
            <div className="stat-label">Total Dishes</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">15K+</div>
            <div className="stat-label">Customers</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">4.8⭐</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <h3 className="card-title">Our Menu</h3>
        <div className="menu-list">
          {video.length > 0 ? (
            video.map((item, index) => (
              <div key={item.id || index} className="menu-item">
                <div className="menu-media">
                  {!videoErrors[item.id || index] ? (
                    <video
                      className="menu-video"
                      src={item.video}
                      muted
                      loop
                      playsInline
                      poster=""
                      onClick={(e) => {
                        if (e.target.paused) {
                          e.target.play();
                          setPlayingVideo(item.id || index);
                        } else {
                          e.target.pause();
                          setPlayingVideo(null);
                        }
                      }}
                      onError={() => {
                        setVideoErrors((prev) => ({
                          ...prev,
                          [item.id || index]: true,
                        }));
                      }}
                    />
                  ) : (
                    <div className="menu-placeholder">
                      <span className="placeholder-icon">🍽️</span>
                    </div>
                  )}
                  <div className="play-overlay">
                    <span className="play-btn">
                      {playingVideo === (item.id || index) ? "⏸️" : "▶️"}
                    </span>
                  </div>
                </div>
                <div className="menu-details">
                  <div className="menu-header">
                    <h4 className="dish-name">{item.name || "Special Dish"}</h4>
                  </div>
                  <p className="dish-description">
                    {item.description ||
                      "Deliciously prepared with fresh ingredients"}
                  </p>
                  <div className="menu-footer">
                    <div className="dish-stats">
                      <span className="stat-likes">
                        ❤️ {item.likes || Math.floor(Math.random() * 100 + 50)}
                      </span>
                      <span className="stat-views">
                        👁️ {item.views || Math.floor(Math.random() * 500 + 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">
              <p>No menu items available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
