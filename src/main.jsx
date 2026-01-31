import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// 1. Import the PWA registration function
import { registerSW } from "virtual:pwa-register";

// 2. Register the service worker to enable "Install" prompt and offline mode
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version of Vanokhi available. Update now?")) {
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
