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

const app = initializeApp(firebaseConfig);//App initialization
const functions = getFunctions(app);//Get functions
connectFunctionsEmulator(functions, 'localhost', 5001); //don't use localhost in deployment //Set connection to local emulator
const post = httpsCallable(functions, 'cnvs_json_post'); //create callable request

export function cnvs_json_post(data) {
    //request to server and add callback
    return post(data)
    .then((result) => handle_results(result))
    .catch((error) => {
        //if an error occurs, log it to console
        console.log(error.message + " : " +  error.details);
        return null;
  });
}

function handle_results(result) {
    console.log("Returned from firebase function call: " + JSON.stringify(result.data));
    if(result.data.status === "E") {
        //todo something nicer than an alert to the user
        alert(result.data.message); //status E=error, S=success
        return null;
    } else {
        let simres = result.data.sim_result; //is json
        let busarray = JSON.parse(simres.buses); //json array of busses
        let linearray = JSON.parse(simres.lines); //json array of lines
        return {'buses':busarray, 'lines':linearray};
    }
}
