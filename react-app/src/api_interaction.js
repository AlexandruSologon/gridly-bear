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
    post(data).then((result) => { //request to server and add callback
        console.log("Returned from firebase function call: " + JSON.stringify(result.data));
        if(result.data.status === "E") alert(result.data.message);
        else {
            let simres = result.data.sim_result; //is json
            let busarray = JSON.parse(simres.buses); //json
            console.log(busarray[0]);
            //console.log(resarray + " is of type " + (typeof resarray) + " with keys " + (Object.keys( resarray)));
            return result.data;
        }
    }).catch((error) => {
        console.log(error.message + " : " +  error.details);
  });
}
