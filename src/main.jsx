import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme/theme.js";
import GlobalStyle from "./styled/GlobalStyle.js";

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
