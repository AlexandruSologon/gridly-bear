import './css-files/index.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';
import { ConfigProvider, Slider } from "antd";
import { MapContainer, Marker, Polyline, ZoomControl } from 'react-leaflet';

import Tile from "./interface-elements/Tile";
import Sidebar from './interface-elements/Sidebar';
import LineSettings from "./interface-elements/LineSettings";
import ToolElements from './interface-elements/ToolElements';
import HistoryDrawer from './interface-elements/HistoryDrawer';
import MarkerSettings from "./interface-elements/MarkerSettings";
import WaitingOverlay from './interface-elements/WaitingOverlay';
import PolylineDecorator from './interface-elements/PolylineDecorator';

import { useEventHandlers } from "./EventHandlers";
import { mapCenter, iconMapping, sidebarItems } from './utils/constants';

export function ReactApp() {
    const {
        mapContainer,
        markerRefs,
        lineRefs,
        markers,
        setMarkers,
        lines,
        setLines,
        isMapLocked,
        setIsMapLocked,
        runClicked,
        setRunClicked,
        defaultValues,
        mapOpacity,
        setMapOpacity,
        isHistoryOn,
        setIsHistoryOn,
        history,
        setHistory,
        highlightedMarker,
        setSelectedMarker,
        messageApi,
        contextHolder,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
        handleMarkerClick,
        handleMarkerDrag,
        handleMarkerDelete,
        handleTransReverse,
        handleMarkerHover,
        handleParameterChange,
        replaceDefaultValues,
        onLockButtonClick,
        handleLineDelete,
        handleMarkerRightClick,
        handleLineClick,
        handleLineRightClick
    } = useEventHandlers();

    document.title = "PandaGUI";

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <WaitingOverlay runClicked={runClicked} />
            <Sidebar handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} iconMapping={iconMapping} sidebarItems={sidebarItems} />
            <ConfigProvider theme={{ token: { colorPrimary: '#193165' } }}>
                <Slider defaultValue={100} style={{width:200, position:'absolute', zIndex: 1001, left:620, top:23}} onChange={(e) => setMapOpacity(e/100)} />
            </ConfigProvider>
            <div
                style={{
                    position: 'relative',
                    flex: '1',
                    height: '100%',
                    marginLeft: '5px'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
                <div style={{ position: 'relative', flex: '1', height: '100%' }}>
                    <MapContainer
                        zoom={13}
                        minZoom={3}
                        maxNativeZoom={19}
                        ref={mapContainer}
                        center={mapCenter}
                        zoomControl={false}
                        dragging={isMapLocked}
                        doubleClickZoom={false}
                        scrollWheelZoom={isMapLocked}
                        style={{ width: '100%', height: '100%', zIndex: 0, opacity: 1 }}>
                        <HistoryDrawer history={history} isHistoryOn={isHistoryOn} setIsHistoryOn={setIsHistoryOn} setMarkers={setMarkers} setLines={setLines}></HistoryDrawer>
                            <Tile opacity={mapOpacity}/>
                        {markers.map((marker, index) => (
                            <Marker key={marker.id}
                                draggable={true}
                                clickable={true}
                                type={marker.type}
                                icon={marker.icon}
                                position={marker.position}
                                ref={(ref) => (markerRefs.current[index] = ref)}
                                eventHandlers={{
                                    click: (e) => handleMarkerClick(e, marker.id),
                                    contextmenu: (e) => handleMarkerRightClick(e),
                                    dragstart: () => setSelectedMarker(null),
                                    drag: (e) => handleMarkerDrag(marker.id, e.target.getLatLng()),
                                    mouseover: () => handleMarkerHover(markerRefs.current[index], true),
                                    mouseout: () => {
                                        //making sure that all markers besides the clicked one can return to normal brightness on hover leave
                                        if (highlightedMarker !== index) {
                                            handleMarkerHover(markerRefs.current[index], false);
                                        }
                                    }
                                 }}>
                                    <MarkerSettings
                                        index={index}
                                        marker={marker}
                                        handleParameterChange={handleParameterChange}
                                        handleMarkerDelete={handleMarkerDelete}
                                        handleTransReverse={handleTransReverse}
                                        replaceDefaultValues = {replaceDefaultValues}/>/>
                                </Marker>))}
                            {lines.map((line, index) => (
                                <Polyline key={index}
                                          weight={10}
                                          clickable={true}
                                          pathOptions={{color: line.color}}
                                          positions={[line.position1, line.position2]}
                                          ref={(ref) => (lineRefs.current[index] = ref)}
                                          eventHandlers={{
                                              click: (e) => handleLineClick(e),
                                              contextmenu: (e) => handleLineRightClick(e)
                                          }}>
                                    <LineSettings line={line} index={index} handleLineDelete={handleLineDelete}></LineSettings>
                                </Polyline>
                            ))}
                            <PolylineDecorator lines = {lines} markers = {markers}> </PolylineDecorator>
                            <ZoomControl position="bottomright" />
                            <ToolElements
                                onLockButtonClick={onLockButtonClick}
                                markers={markers}
                                setMarkers={setMarkers}
                                lines={lines}
                                setLines={setLines}
                                mapContainer={mapContainer}
                                runClicked={runClicked}
                                setRunClicked={setRunClicked}
                                setIsMapLocked={setIsMapLocked}
                                markerRefs={markerRefs}
                                messageApi={messageApi}
                                defaultValues={defaultValues}
                                isHistoryOn={isHistoryOn}
                            setIsHistoryOn={setIsHistoryOn}
                            setHistory={setHistory}
                            history={history}
                            ></ToolElements>
                        </MapContainer>
                        {contextHolder}
                </div>
            </div>
        </div>
    );
}

export default ReactApp;