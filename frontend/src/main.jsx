import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SavedProvider } from "./context/SavedContext.jsx";
import "./styles/theme.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SavedProvider>
      <App />
    </SavedProvider>
  </StrictMode>
);
