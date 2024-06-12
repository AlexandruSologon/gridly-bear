import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import { ConfigProvider, Flex, Slider } from "antd";
import { onRunButtonClick } from '../utils/api';
import RunButton from "./RunButton";
import Search from "./Search";

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
                    <Slider defaultValue={100} style={{width:200}} onChange={(e) => props.opacityChange(e/100)} />
                    <Search />
                    <LockButton onLockButtonClick={props.onLockButtonClick} />
                    <ImportButton markerRefs={props.markerRefs} lineRefs={props.lineRefs} setMarkers={props.setMarkers} setLines={props.setLines} mapContainer={props.mapContainer}></ImportButton>
                    <ExportButton markers={props.markers} lines={props.lines} mapContainer={props.mapContainer}></ExportButton>
                    <RunButton runClicked={props.runClicked} onRunButtonClick={() => onRunButtonClick(props.markers, props.runClicked, props.setRunClicked, props.setIsMapLocked, props.lines, props.setLines, props.setMarkers, props.markerRefs, props.messageApi, props.defaultValues)} />  
                </Flex>
                
            </div>
        </ConfigProvider>
    );
}

export default ToolElements;
