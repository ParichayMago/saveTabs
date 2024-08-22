import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
export const BASE_URL = "http://localhost:4000";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <div className="h-screen bg-gray-800">
          <App />
        </div>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
