import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { registerSW } from "virtual:pwa-register";

// Register the service worker for PWA features
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Update now?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Vanokhi is ready to work offline.");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);