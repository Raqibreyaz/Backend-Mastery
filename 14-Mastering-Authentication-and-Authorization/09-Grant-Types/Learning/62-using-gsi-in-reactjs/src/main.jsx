import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={
        "233479796620-ch30kn6215kfo0rjln4kk5r6nmt0us29.apps.googleusercontent.com"
      }
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
