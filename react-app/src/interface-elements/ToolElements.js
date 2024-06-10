import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import { ConfigProvider, Flex } from "antd";
import { onRunButtonClick } from '../utils/api';
import RunButton from "./RunButton";
import Search from "./Search";
import HistoryButton from "./HistoryButton.js";

function ToolElements(props) {
    
    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#193165' } }}>
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
                    <Search />
                    <LockButton onLockButtonClick={props.onLockButtonClick} />
                    <ImportButton markerRefs={props.markerRefs} lineRefs={props.lineRefs} setMarkers={props.setMarkers} setLines={props.setLines} setBusLines={props.setBusLines} mapContainer={props.mapContainer}></ImportButton>
                    <ExportButton markers={props.markers} lines={props.lines} busLines={props.busLines} mapContainer={props.mapContainer}></ExportButton>
                    <HistoryButton isHistoryOn={props.isHistoryOn} setIsHistoryOn={props.setIsHistoryOn}></HistoryButton>
                    <RunButton runClicked={props.runClicked} onRunButtonClick={() => onRunButtonClick(props.markers, props.busLines, props.runClicked, props.setRunClicked, props.setIsMapLocked, props.lines, props.setLines, props.setBusLines, props.setMarkers, props.markerRefs, props.messageApi, props.defaultValues)} />
                </Flex>
                
            </div>
        </ConfigProvider>
    );
}

export default ToolElements;
