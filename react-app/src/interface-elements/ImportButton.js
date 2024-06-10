//import { IconButton } from "@mui/material";
import { useRef } from "react";
import { iconMapping } from "../utils/constants";
import { useMap } from 'react-leaflet';
import { LatLng } from "leaflet";
import { Button, Tooltip } from "antd";
import impIcon from '../images/import.png';

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

        map.setView(loadedFileJson.center, loadedFileJson.zoom);
        setMarkers(newMarkers);
        setLines(newLines);
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
        <Tooltip title="import">
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
