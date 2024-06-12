//import { IconButton } from "@mui/material";
import { useRef } from "react";
import { useMap } from 'react-leaflet';
import { Button, Tooltip } from "antd";
import impIcon from '../images/import.png';
import CanvasState from "../utils/CanvasState";
import {resetMarkerRender} from "../utils/api";

function ImportButton({setMarkers, setLines, mapContainer, markerRefs, lineRefs}) {

    const fileRef = useRef(null);

    const map = useMap();

    const handleChange = (event) => {
        let selectedFile = event.target.files[0];

        // Read the file content
        const reader = new FileReader();
        reader.onload = (e) => {loadAction(e)};
        if(selectedFile != null) reader.readAsText(selectedFile);
        event.target.value = null;
    };

    const loadAction = (e) => {
        //Reset references for lines and markers
        lineRefs = null;

        //Get the contents of the loaded file
        const fileContent = e.target.result;
        console.log("File content: ", fileContent);

        // Now you can parse the JSON content or handle it as needed
        let loadedFileJson = JSON.parse(fileContent);
        console.log("Loaded file Json: ", loadedFileJson);
        resetMarkerRender(loadedFileJson.markers, markerRefs.current)
        //Draw the elements on screen (by applying the past state)
        const newState = new CanvasState(loadedFileJson.markers, markerRefs, loadedFileJson.lines, loadedFileJson.center, loadedFileJson.zoom, new Date());
        newState.applyState(setMarkers, setLines, map);
    };

    const ImportIcon = () => (
        <img
          src={impIcon}
          alt="Import Icon"
          draggable="false"
          style={{
            width: 20,
            height: 20,
          }}
        />
      );      

    return(
        <Tooltip title="Import">
            <Button className={'hasShadow'}
                    style={{width: 40, boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)'}}
                    size={'large'}
                    onClick={() => fileRef.current.click()}
                    type="default"
                    shape="square" icon={<ImportIcon/>}>
                <input style={{display: 'none'}} id="upload" name="upload" type="file" ref={fileRef} hidden onChange={handleChange} />
            </Button>
        </Tooltip>
    );
}

export default ImportButton;
