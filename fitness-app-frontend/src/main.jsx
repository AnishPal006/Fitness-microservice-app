import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./authConfig";

// --- New Imports ---
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import "./index.css"; // We'll update this file next

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider
      authConfig={authConfig}
      loadingComponent={<div>Loading...</div>}
    >
      <Provider store={store}>
        {/* Wrap your app in the ThemeProvider */}
        <ThemeProvider theme={theme}>
          {/* CssBaseline resets styles and applies the background color */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
