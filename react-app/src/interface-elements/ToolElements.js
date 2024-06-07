import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import { Flex } from "antd";
import { onRunButtonClick } from '../utils/api';
import RunButton from "./RunButton";

function ToolElements(props) {
    return (
        <div style={
            {
                position: "absolute",
                top: '20px',
                right : '20px',
                display:'flex',
                justifyContent:'row',
                alignItems:'column',
                zIndex: 500
            }
        }>
            <Flex gap="middle" wrap>
                <LockButton onLockButtonClick={props.onLockButtonClick} />
                <ImportButton markerRefs={props.markerRefs} lineRefs={props.lineRefs} setMarkers={props.setMarkers} setLines={props.setLines} setBusLines={props.setBusLines} mapContainer={props.mapContainer}></ImportButton>
                <ExportButton markers={props.markers} lines={props.lines} busLines={props.busLines} mapContainer={props.mapContainer}></ExportButton>
                <RunButton runClicked={props.runClicked} onRunButtonClick={() => onRunButtonClick(props.markers, props.busLines, props.runClicked, props.setRunClicked, props.setIsMapLocked, props.lines, props.setLines, props.setBusLines, props.setMarkers, props.markerRefs, props.messageApi, props.defaultValues)} />
            </Flex>
            
        </div>
    );
}

export default ToolElements;
