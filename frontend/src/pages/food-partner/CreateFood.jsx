import React, { useEffect, useState } from "react";
import "../../styles/create-food.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_VIDEO_SIZE_MB = 200;

const CreateFood = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(videoFile);
    setVideoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [videoFile]);

  const fileSizeWarning = (() => {
    if (!videoFile) return "";
    const sizeInMb = videoFile.size / (1024 * 1024);
    if (sizeInMb <= MAX_VIDEO_SIZE_MB) return "";
    return `Video exceeds ${MAX_VIDEO_SIZE_MB}MB limit (${sizeInMb.toFixed(
      1
    )}MB).`;
  })();

  const videoHint = videoFile
    ? `Selected • ${videoFile.name}`
    : "Drop video file here or browse to upload";

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setVideoFile(file);
    setFormTouched(true);
  };

  const handleFileInputChange = (event) => {
    handleVideoChange(event.target.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleVideoChange(event.dataTransfer?.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormTouched(true);

    if (!formData.name.trim() || !formData.description.trim() || !videoFile) {
      return;
    }

    if (fileSizeWarning) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("video", videoFile);

    try {
      await axios.post("http://localhost:3000/api/food", payload, {
        withCredentials: true,
      });

      setFormData({ name: "", description: "" });
      setVideoFile(null);
      setFormTouched(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to publish dish:", error);
      alert(error.response?.data?.message || "Unable to publish dish");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !formData.name.trim() ||
    !formData.description.trim() ||
    !videoFile ||
    Boolean(fileSizeWarning) ||
    isSubmitting;

  return (
    <div className="food-create-page">
      <div className="food-create-shell">
        <header className="food-create-header">
          <div className="food-create-breadcrumb">
            <span>Dashboard</span>
            <span aria-hidden>&rsaquo;</span>
            <span>Menu</span>
            <span aria-hidden>&rsaquo;</span>
            <strong>Create Food Item</strong>
          </div>
          <div className="food-create-heading">
            <h1>Share a new dish</h1>
            <p>
              Capture your signature recipe. Upload a short plating video, then
              add details, pricing, and notes so diners know what to expect.
            </p>
          </div>
        </header>

        <main className="food-create-content">
          <form className="food-create-form" onSubmit={handleSubmit}>
            <section className="food-form-section">
              <div className="food-form-field">
                <label htmlFor="name">Dish name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="E.g. Fire-roasted aubergine curry"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(true)}
                />
                {formTouched && !formData.name.trim() && (
                  <span className="food-form-error">Name is required.</span>
                )}
              </div>

              <div className="food-form-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Tell diners what makes this dish special, highlight ingredients, allergens, or serving notes."
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={() => setFormTouched(true)}
                />
                {formTouched && !formData.description.trim() && (
                  <span className="food-form-error">
                    Description can&rsquo;t be empty.
                  </span>
                )}
              </div>
            </section>

            <footer className="food-form-footer">
              <button
                type="submit"
                className="food-button primary"
                disabled={isSubmitDisabled}
              >
                {isSubmitting ? "Publishing…" : "Publish dish"}
              </button>
            </footer>
          </form>

          <aside className="food-create-preview">
            <div
              className={`food-video-dropzone ${
                isDragging ? "is-dragging" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="video"
                name="video"
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={handleFileInputChange}
              />

              <div className="food-video-content">
                <div className="food-video-icon" aria-hidden>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="6"
                      y="8"
                      width="36"
                      height="28"
                      rx="6"
                      fill="rgba(99, 102, 241, 0.08)"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                    />
                    <path
                      d="M22 20.5L28 24L22 27.5V20.5Z"
                      fill="var(--color-accent)"
                    />
                    <path
                      d="M12 32H36"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p>{videoHint}</p>
                <span>MP4, MOV, or WebM up to {MAX_VIDEO_SIZE_MB}MB.</span>
                <label className="food-browse-button" htmlFor="video">
                  Browse video
                </label>
              </div>
            </div>

            {videoPreviewUrl && (
              <div className="food-video-preview" aria-live="polite">
                <video src={videoPreviewUrl} controls preload="metadata" />
                <div className="food-video-details">
                  <div>
                    <h3>{formData.name || "Untitled dish"}</h3>
                    <p>{videoFile?.name}</p>
                  </div>
                  <div className="food-video-meta">
                    <span>
                      {videoFile
                        ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {formTouched && !videoFile && (
              <span className="food-form-error">Video is required.</span>
            )}

            {fileSizeWarning && (
              <span className="food-form-error">{fileSizeWarning}</span>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default CreateFood;
