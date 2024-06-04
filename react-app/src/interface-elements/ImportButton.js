import { IconButton } from "@mui/material";
import { useState, useRef } from "react";
import { iconMapping } from "../utils/constants";
import { LatLng } from "leaflet";

function ImportButton({setMarkers, setLines, setBusLines, mapContainer, markerRefs, lineRefs}) {

    const fileRef = useRef(null);
    let [file, setFile] = useState();

    const handleChange = (event) => {
        let selectedFile = event.target.files[0];
        setFile(selectedFile);
        // Read the file content
        const reader = new FileReader();
        reader.onload = (e) => {loadAction(e)};
        reader.readAsText(selectedFile);
        
    };

    const loadAction = (e) => {
        markerRefs = null;
        lineRefs = null;
        const fileContent = e.target.result;
        console.log("File content:", fileContent);
        // Now you can parse the JSON content or handle it as needed
        let loadedFileJson = JSON.parse(fileContent);
        console.log(loadedFileJson);
        //Draw the elements on screen
        let newMarkers = loadedFileJson.markers.map((marker) => {
            marker.icon = iconMapping[marker.type];
            marker.position = new LatLng(marker.position.lat, marker.position.lng);
            return marker;
        });

        let newLines = loadedFileJson.lines.map((line) => {
            line[0] = new LatLng(line[0].lat, line[0].lng);
            line[1] = new LatLng(line[1].lat, line[1].lng);
            return line;
        });
        
        setMarkers(newMarkers);
        setLines(newLines);
        setBusLines(loadedFileJson.busLines);
    };

    return(
        <IconButton 
            draggable = 'false'
            aria-label="check"
            data-testid = "lockbutton"
            style={{
                opacity: '30'
            }} onClick={() => fileRef.current.click()} >
            <div style={{position: 'relative'}}>
                <img src={require('../images/import.png')}
                    alt={"import"}
                    draggable='false'
                    style={{
                        width: 40,
                        height: 40
                    }}
                />
                <input id="upload" name="upload" type="file" ref={fileRef} hidden onChange={handleChange} />
            </div>
        </IconButton>
    );
}

export default ImportButton;
