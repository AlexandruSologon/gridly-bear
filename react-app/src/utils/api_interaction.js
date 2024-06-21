import { initializeApp } from "firebase/app"; //Import the functions you need from the SDKs you need for firebase
import { getFunctions, httpsCallable } from "firebase/functions";
//  import {connectFunctionsEmulator} from "firebase/functions";

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
// connectFunctionsEmulator(functions, 'localhost', 5001); //don't use localhost in deployment //Set connection to local emulator
const post = httpsCallable(functions, 'cnvs_json_post', {timeout: 200000}); //create callable request with timeout at 20 seconds

/**
 * 
 * @param {*} data the json representation of canvas data to send to the server 
 * @returns the result of running the simulation {buses: <array of buses>, line: <array of lines>}
 */
export function cnvs_json_post(data) {
    //request to server and add callback
    return post(data)
    .then((result) => handle_results(result))
    .catch((error) => {
        //if an error occurs, log it to console
        console.log(error.message + " : " +  error.details);
        throw new Error(error.message);
    });
}

function handle_results(result) {
    console.log("Returned from firebase function call: " + JSON.stringify(result.data));
    if(result.data.status === "E") {
        //todo something nicer than an alert to the user
        //alert(result.data.message); //status E=error, S=success
        throw new Error(result.data.message);
    } else {
        const simres = result.data.sim_result; //is json
        const busarray = JSON.parse(simres.buses); //json array of buses
        const linearray = JSON.parse(simres.lines); //json array of lines
        const l = JSON.parse(simres.line_results)
        const b = JSON.parse(simres.bus_results)
        return {'buses':busarray, 'lines':linearray, 'res_lines':l, 'res_buses':b};
    }
}
