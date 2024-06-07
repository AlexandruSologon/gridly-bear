import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import { Button, Flex } from "antd";

function ToolElements({onLockButtonClick, markers, setMarkers, lines, setLines, busLines, setBusLines, mapContainer, markerRefs, lineRefs}) {
    return (
        <div style={
            {
                position: "absolute",
                marginRight: '10px',
                top: '5px',
                right : '60px',
                display:'flex',
                justifyContent:'row',
                alignItems:'column'
            }
        }>
            <Flex gap="small" wrap>
                <LockButton onLockButtonClick={onLockButtonClick} />
                <ImportButton markerRefs={markerRefs} lineRefs={lineRefs} setMarkers={setMarkers} setLines={setLines} setBusLines={setBusLines} mapContainer={mapContainer}></ImportButton>
                <ExportButton markers={markers} lines={lines} busLines={busLines} mapContainer={mapContainer}></ExportButton>
            </Flex>
            
        </div>
    );
}

export default ToolElements;
