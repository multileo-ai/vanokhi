import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// 1. Import the native GoogleAuth plugin
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

// 2. Initialize it with your Web Client ID
// REPLACE 'YOUR_WEB_CLIENT_ID' with the long string you found in Google Cloud
GoogleAuth.initialize({
  clientId:
    "399331187738-eflpp9q55b7u250g7kudg85j9j4f801o.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  grantOfflineAccess: true, // Recommended for smooth Firebase sync
});

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
