import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bfa5", // A modern teal
    },
    secondary: {
      main: "#ff4081", // A vibrant pink for accents
    },
    background: {
      default: "#121212", // Standard dark background
      paper: "#1e1e1e", // Darker paper for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
});
