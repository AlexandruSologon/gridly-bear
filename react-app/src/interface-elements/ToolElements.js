import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import { ConfigProvider, Flex, Slider } from "antd";
import { onRunButtonClick } from '../utils/api';
import RunButton from "./RunButton";
import Search from "./Search";
import HistoryButton from "./HistoryButton.js";
import { useMap } from "react-leaflet";

function ToolElements(props) {

    const map = useMap();
    
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
                    <ImportButton markerRefs={props.markerRefs} lineRefs={props.lineRefs} setMarkers={props.setMarkers} setLines={props.setLines} mapContainer={props.mapContainer}></ImportButton>
                    <ExportButton markerRefs={props.markerRefs} markers={props.markers} lines={props.lines} mapContainer={props.mapContainer}></ExportButton>
                    <HistoryButton isHistoryOn={props.isHistoryOn} setIsHistoryOn={props.setIsHistoryOn}></HistoryButton>
                    <RunButton setHistory={props.setHistory} runClicked={props.runClicked} onRunButtonClick={() => onRunButtonClick(props.markers, props.runClicked, props.setRunClicked, props.setIsMapLocked, props.lines, props.setLines, props.setMarkers, props.markerRefs, props.messageApi, props.history, props.setHistory, map)} />
                </Flex>
            </div>
        </ConfigProvider>
    );
}

export default ToolElements;
