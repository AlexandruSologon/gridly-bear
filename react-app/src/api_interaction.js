import { initializeApp } from "firebase/app"; //Import the functions you need from the SDKs you need for firebase
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyD7n865HujlU9MJe9uQ1H4rxMjv_dTIDqQ",
    authDomain: "pandapower-ui.firebaseapp.com",
    projectId: "pandapower-ui",
    storageBucket: "pandapower-ui.appspot.com",
    messagingSenderId: "358186979923",
    appId: "1:358186979923:web:cde03b5e29c8099bd3eca6",
    measurementId: "G-773KGRGD70"
};

export function cnvs_json_post(data) {
    //App initialization
    const app = initializeApp(firebaseConfig);
    //Get functions 
    const functions = getFunctions(app);
    //Set connection to local emulator
    connectFunctionsEmulator(functions, 'localhost', 5001); //don't use localhost in deployment
    const post = httpsCallable(functions, 'cnvs_json_post'); //create callable request
    post(data).then((result) => { //request to server and add callback
        console.log("Returned from firebase function call: " + result.data);
        if(result.data === "Invalid network submitted") alert("Invalid network submitted");
        return result.data;
    }).catch((error) => {
        //const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log(message + " : " +  details);
        return {'result' : "None"};
  });
}
