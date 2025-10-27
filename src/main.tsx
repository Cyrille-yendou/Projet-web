import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { App } from "./App";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>
);