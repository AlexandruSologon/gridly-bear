import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import ReactApp from "./App";
import { initializeApp } from "firebase/app";// Import the functions you need from the SDKs you need for firebase
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
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

/*
  * This is a helloworld example function, this should not be deployed
  */
function useFunctionsEmulator() {
  console.log("!!changing functions api address to local emulator uri!!");
  const app = initializeApp(firebaseConfig);
  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  const helloWorld = httpsCallable(functions, 'hello_world'); //create callable request
  helloWorld().then((result) => { //request to server and add callback
    console.log("Returned from firebase function call: " + result.data);
  }).catch((error) => {
    //const code = error.code;
    const message = error.message;
    const details = error.details;
    console.log(message + " : " +  details);
  });
}

//Wrapper
function App() {
  useFunctionsEmulator(); //custom hook for connecting to the emulator, remove this in production.
  return <ReactApp /> // the rest of the App component
}

//Render the actual app on the root of the page.
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
