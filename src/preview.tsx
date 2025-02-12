import React from "react";
import ReactDOM from "react-dom/client";
import { TempoDevtools } from "tempo-devtools";

if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}
import "./styles/index.scss";
import Preview from "./components/CourseBuilder/Preview";

function PreviewPage() {
  return <Preview />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PreviewPage />
  </React.StrictMode>,
);
