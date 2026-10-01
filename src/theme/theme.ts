"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    background: { default: "#f5f7fb" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-roboto), Roboto, sans-serif",
  },
});
