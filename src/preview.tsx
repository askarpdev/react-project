import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import Preview from "./components/CourseBuilder/Preview";

// Only initialize Tempo in development
if (import.meta.env.DEV) {
  const { TempoDevtools } = await import("tempo-devtools");
  TempoDevtools.init();
}

function PreviewPage() {
  return <Preview />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PreviewPage />
  </React.StrictMode>,
);
