import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css-files/style.css";
import ReactApp from "./App";

//Render the actual app on the root of the page.
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ReactApp />
  </StrictMode>
);
