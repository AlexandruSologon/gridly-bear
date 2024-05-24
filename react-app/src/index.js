import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import ReactApp from "./App";
import { initializeApp } from "firebase/app";// Import the functions you need from the SDKs you need for firebase
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

//Render the actual app on the root of the page.
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ReactApp />
  </StrictMode>
);
