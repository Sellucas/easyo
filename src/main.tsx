import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);
