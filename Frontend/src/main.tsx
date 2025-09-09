import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
<link href="/dist/styles.css" rel="stylesheet" />;
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
