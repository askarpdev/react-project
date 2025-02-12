import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PreviewWindow from "./components/CourseBuilder/Preview/PreviewWindow";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PreviewWindow />
  </React.StrictMode>,
);
