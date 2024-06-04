import { IconButton } from "@mui/material";
import { useState, useRef } from "react";
import { iconMapping } from "../utils/constants";

function ImportButton({markerRefs, lineRefs, setMarkers, setLines, setBusLines, markers}) {

    const fileRef = useRef(null);
    let [file, setFile] = useState();

    const handleChange = (event) => {
        let selectedFile = event.target.files[0];
        setFile(selectedFile);
        // Read the file content
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            console.log("File content:", fileContent);
            // Now you can parse the JSON content or handle it as needed
            let loadedFileJson = JSON.parse(fileContent);
            console.log(loadedFileJson);
            //Draw the elements on screen
            let newMarkers = loadedFileJson.markers.map((marker) => {
                marker.icon = iconMapping[marker.type];
                return marker;
            });
            
            setMarkers(newMarkers);
            setLines(loadedFileJson.lines);
            setBusLines(loadedFileJson.busLines);
        };
        reader.readAsText(selectedFile);
        console.log("refs: "); console.log(markerRefs);
    };

    return(
        <IconButton 
            aria-label="check"
            data-testid = "lockbutton"
            style={{
                margin: '5px',
                width: '40px',
                height: '40px',
                opacity: '30'
            }} onClick={() => fileRef.current.click()} >
            <div style={{position: 'relative'}}>
                <img src={require('../images/import.png')}
                    alt={"import"}
                    style={{
                        width: 50,
                        height: 50
                    }}
                />
                <input id="upload" name="upload" type="file" ref={fileRef} hidden onChange={handleChange} />
            </div>
        </IconButton>
    );
}

export default ImportButton;