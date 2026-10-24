import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

/* Fuentes locales (funcionan sin internet) */
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import { AuthProvider } from "./features/auth";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer />
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
