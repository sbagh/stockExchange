import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const root = (ReactDOM as any).createRoot(document.getElementById("root")!);
root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);
