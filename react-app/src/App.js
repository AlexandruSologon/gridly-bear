import './css-files/index.css';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash.debounce';
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl } from 'react-leaflet';
import { onRunButtonClick } from './utils/api';
import {mapCenter, iconMapping, markerParametersConfig, defVal} from './utils/constants';
import Search from './interface-elements/Search';
import Sidebar from './interface-elements/Sidebar';
import RunButton from './interface-elements/RunButton';
import LockButton from './interface-elements/LockButton';
import DeleteButton from './interface-elements/DeleteButton';
import WaitingOverlay from './interface-elements/WaitingOverlay';

export function ReactApp() {
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);
    const markerRefs = useRef([]);
    const lineRefs = useRef([]);
    const [lines, setLines] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isMapLocked, setIsMapLocked] = useState(true);
    const [busLines, setBusLines] = useState([]);
    const [runClicked, setRunClicked] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [defaultValues, setDefaultValues] =  useState(defVal);

    const handleDragStart = (event, item) => {
        setDraggedItem(item);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (draggedItem) {
            const { clientX, clientY } = event;
            const { left, top } = event.currentTarget.getBoundingClientRect();
            const x = clientX - left;
            const y = clientY - top;
            const droppedLatLng = mapContainer.current.containerPointToLatLng([x, y]);
            const icon = iconMapping[draggedItem.type];
            const parametersConfig = markerParametersConfig[draggedItem.type];
            const parameters = parametersConfig ? parametersConfig.reduce((acc, param) => {
                acc[param] = '';
                return acc;
            }, {}) : {};
            console.log(defaultValues)
            for (const key in parameters)
                parameters[key] = defaultValues[draggedItem.type][key]
            const newMarker = {
                id: markers.length,
                position: droppedLatLng,
                name: draggedItem.name,
                icon,
                type: draggedItem.type,
                parameters,
                color: '#000'
            };
            setMarkers([...markers, newMarker]);
        }
        setDraggedItem(null);
    };

    const handleMarkerClick = (event, markerIndex) => {
        const targetMarker = event.target;
        if (targetMarker) {
            targetMarker.closePopup();
        }
        if (selectedMarker === null) {
            setSelectedMarker(markerIndex);
        } else {
            if (selectedMarker !== markerIndex && (markers[selectedMarker].icon.options.id === "bus" || markers[markerIndex].icon.options.id === "bus")) {
                if (markers[selectedMarker] && markers[markerIndex]) {
                    let color = "#358cfb";
                    if(markers[selectedMarker].icon.options.id === "bus" && markers[markerIndex].icon.options.id === "bus") color = "#000"
                    if (lines.length === 0 || lines[lines.length - 1].length === 3) {
                        const newLine = [markers[selectedMarker].position, markers[markerIndex].position,  color];
                        const newBusLine = [markers[selectedMarker].id, markers[markerIndex].id].sort();
                        let found = false;
                        for (let i = 0; i < busLines.length; i++) {
                            const item = busLines[i];
                            if (item[0] === newBusLine[0] && item[1] === newBusLine[1]) {
                                found = true;
                                break;
                            }
                        }
                        if (!found){
                            setLines([...lines, newLine]);
                            setBusLines([...busLines, newBusLine]);
                            lineRefs.current.push(newLine);
                        }
                    } else {
                        const newLine = [[markers[selectedMarker].position, markers[markerIndex].position],  '#000'];
                        setLines([...lines.slice(0, lines.length - 1), newLine]);
                        lineRefs.current.push(newLine);
                    }
                }
            }
            setSelectedMarker(null);
        }
    };

    const handleMarkerDrag = debounce((markerIndex, newPosition) => {
        const updatedMarkers = markers.map((marker, index) => {
            if (index === markerIndex) {
                return { ...marker, position: newPosition };
            }
            return marker;
        });

        const updatedLines = lines.map(line => line.map(point => {
            if (point === markers[markerIndex].position && (point === line[0] || point === line[1])) {
                return newPosition;
            }
            return point;
        }));

        setMarkers(updatedMarkers);
        setLines(updatedLines);
    }, 100);

    const handleMarkerDelete = (indexMarker) => {
        const oldMarkerPos = markers[indexMarker].position;
        const markerRef = markerRefs.current[indexMarker];
        if (markerRef) {
            markerRef.closePopup();
        }
        const updatedMarkers = [...markers];
        updatedMarkers.splice(indexMarker, 1);
        setMarkers(updatedMarkers);
        markerRefs.current.splice(indexMarker, 1);
        if (selectedMarker === indexMarker) {
            setSelectedMarker(null);
        }
        const updatedLines = lines.filter(line => !(line[0] === oldMarkerPos || line[1] === oldMarkerPos));
        setLines(updatedLines);
        const updatedBusLines = busLines.filter(line => !(line[0] === indexMarker || line[1] === indexMarker));
        setBusLines(updatedBusLines);
    };

    const handleLineDelete = (index) => {
        const lineRef = lineRefs.current[index];
        if (lineRef) {
            lineRef.closePopup();
        }
        const updatedLines = [...lines.slice(0, index), ...lines.slice(index + 1)];
        const updatedBusLines = [...busLines.slice(0, index), ...busLines.slice(index + 1)];
        setBusLines(updatedBusLines);
        setLines(updatedLines);
        lineRefs.current.splice(index, 1);
    };

    const handleMarkerRightClick = (event) => {
        const targetMarker = event.target;
        if (targetMarker && targetMarker.getPopup()) {
            targetMarker.openPopup();
        }
    };

    const handleLineClick = (event, markerIndex) => {
        const targetLine = event.target;
        if (targetLine) {
            targetLine.closePopup();
        }
    };

    const handleLineRightClick = (event) => {
        const targetLine = event.target;
        if (targetLine && targetLine.getPopup()) {
            targetLine.openPopup();
        }
    };

    const renderParameterInputs = (marker) => {
        const { id, type, parameters } = marker;
        const parameterFields = markerParametersConfig[type];
        if (!parameterFields) {
            console.log('Parameters configuration not found for marker type:', type);
            return null;
        }
        return parameterFields.map(param => (
            <div key={param} style={{ marginBottom: '5px' }}>
                <input
                    type="text"
                    placeholder={param.charAt(0).toUpperCase() + param.slice(1)}
                    value={parameters[param] || ''}
                    onChange={(e) => handleParameterChange(id, param, e.target.value)}
                />
            </div>
        ));
    };

    const handleParameterChange = (markerId, paramName, value) => {
        const newValues = {...defaultValues, [markers[markerId].type]: {...defaultValues[markers[markerId].type], [paramName]: value }}
        setDefaultValues(newValues)
        const updatedMarkers = markers.map(marker => {
            if (marker.id === markerId) {
                return {
                    ...marker,
                    parameters: {
                        ...marker.parameters,
                        [paramName]: value
                    }
                };
            }
            return marker;
        });
        setMarkers(updatedMarkers);
    };

    const handleMarkerHover = (markerIndex) => {
        if (selectedMarker !== null) {
            const markerElement = document.querySelector(`.leaflet-marker-icon[title="Marker ${markerIndex + 1}"]`);
            if (markerElement) {
                markerElement.classList.add('marker-hover');
            }
        }
    };

    const handleMarkerLeave = () => {
        const markerElements = document.querySelectorAll('.leaflet-marker-icon');
        markerElements.forEach(markerElement => {
            markerElement.classList.remove('marker-hover');
        });
    };

    const onLockButtonClick = () => {
        setIsMapLocked(!isMapLocked);
        const map = mapContainer.current;
        if (isMapLocked) {
            map.dragging.disable();
            map.keyboard.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
        } else {
            map.dragging.enable();
            map.keyboard.enable();
            map.scrollWheelZoom.enable();
        }
        return isMapLocked;
    };

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <WaitingOverlay runClicked={runClicked} />
            <Sidebar handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} iconMapping={iconMapping} />
            <div
                style={{
                    position: 'relative',
                    flex: '1',
                    height: '100%',
                    marginLeft: '5px'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div style={{ position: 'relative', flex: '1', height: '100%' }}>
                    <MapContainer
                        dragging={isMapLocked}
                        ref={mapContainer}
                        center={mapCenter}
                        zoom={13}
                        maxNativeZoom={19}
                        minZoom={3}
                        style={{ width: '100%', height: '100%', zIndex: 0, opacity: 1 }}
                        zoomControl={false}
                        attributionControl={false}
                        doubleClickZoom={false}
                        scrollWheelZoom={isMapLocked}
                    >
                        <Search />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            opacity={0.4}
                        />
                        {markers.map((marker, index) => (
                            <Marker key={index}
                                    position={marker.position}
                                    icon={marker.icon}
                                    draggable={true}
                                    clickable={true}
                                    ref={(ref) => (markerRefs.current[index] = ref)}
                                    className="dot"
                                    eventHandlers={{
                                        click: (e) => handleMarkerClick(e, index),
                                        contextmenu: (e) => handleMarkerRightClick(e),
                                        dragstart: () => setSelectedMarker(null),
                                        drag: (e) => handleMarkerDrag(index, e.target.getLatLng()),
                                    }}
                            >
                                <Popup>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ marginBottom: '5px' }}>{marker.name}</div>
                                        {renderParameterInputs(marker)}
                                        <div style={{ marginBottom: '5px' }}>
                                            <DeleteButton onClick={() => handleMarkerDelete(index)} />
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {lines.map((line, index) => (
                            <Polyline key={index}
                                      positions={[line[0], line[1]]}
                                      pathOptions={{ color: line[2] }}
                                      clickable={true}
                                      weight={10}
                                      ref={(ref) => (lineRefs.current[index] = ref)}
                                      eventHandlers={{
                                          click: (e) => handleLineClick(e),
                                          contextmenu: (e) => handleLineRightClick(e)
                                      }}
                            >
                                <Popup>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ marginBottom: '5px' }}>{"Connection"}</div>
                                        <div style={{ marginBottom: '5px' }}>
                                            <DeleteButton onClick={() => handleLineDelete(index)} />
                                        </div>
                                    </div>
                                </Popup>
                            </Polyline>
                        ))}
                        <ZoomControl position="topright" />
                    </MapContainer>
                    <LockButton onLockButtonClick={onLockButtonClick} />
                    <RunButton runClicked={runClicked} onRunButtonClick={() => onRunButtonClick(markers, busLines, runClicked, setRunClicked, setIsMapLocked, lines, setLines, setBusLines, setMarkers, markerRefs, defaultValues)} />
                </div>
            </div>
        </div>
    );
}

export default ReactApp;
