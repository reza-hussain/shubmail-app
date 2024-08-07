import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./antd.css";
import App from "./App";
import { StateProvider } from "./context/StateProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>
);
