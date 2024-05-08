import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

import App from "./App";

import { initializeApp } from "firebase/app";// Import the functions you need from the SDKs you need for firebase
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7n865HujlU9MJe9uQ1H4rxMjv_dTIDqQ",
  authDomain: "pandapower-ui.firebaseapp.com",
  projectId: "pandapower-ui",
  storageBucket: "pandapower-ui.appspot.com",
  messagingSenderId: "358186979923",
  appId: "1:358186979923:web:cde03b5e29c8099bd3eca6",
  measurementId: "G-773KGRGD70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);