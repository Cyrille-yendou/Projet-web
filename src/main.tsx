import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { App } from "./App";
import { StrictMode } from "react";
import { CartProvider } from '../src/context/cartContext';
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
      </BrowserRouter>
  </StrictMode>
);