import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";

function ToolElements({markerRefs, lineRefs, onLockButtonClick, markers, setMarkers, lines, setLines, busLines, setBusLines, mapContainer}) {
    return (
        <div style={
            {
                position: "absolute",
                top: '5px',
                right : '60px',
                display:'flex',
                justifyContent:'row'
            }
        }>
            <LockButton onLockButtonClick={onLockButtonClick} />
            <ImportButton markerRefs={markerRefs} lineRefs={lineRefs} setMarkers={setMarkers} setLines={setLines} setBusLines={setBusLines}></ImportButton>
            <ExportButton markerRefs={markerRefs} lineRefs={lineRefs} markers={markers} lines={lines} busLines={busLines} mapContainer={mapContainer}></ExportButton>
        </div>
    );
}

export default ToolElements;