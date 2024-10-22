import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup.tsx";
import "./index.css";
import { ThemeProvider } from "./provider/theme-provider.tsx";
import { PageDataProvider } from "./provider/page-data-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PageDataProvider>
        <Popup />
      </PageDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
