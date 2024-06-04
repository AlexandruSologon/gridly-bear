import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";

function ToolElements({onLockButtonClick, markers, setMarkers, lines, setLines, busLines, setBusLines, mapContainer, markerRefs, lineRefs}) {
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
            <ImportButton markerRefs={markerRefs} lineRefs={lineRefs} setMarkers={setMarkers} setLines={setLines} setBusLines={setBusLines} mapContainer={mapContainer}></ImportButton>
            <ExportButton markers={markers} lines={lines} busLines={busLines} mapContainer={mapContainer}></ExportButton>
        </div>
    );
}

export default ToolElements;