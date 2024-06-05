import './css-files/index.css';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash.debounce';
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl } from 'react-leaflet';
import { onRunButtonClick } from './utils/api';
import {mapCenter, iconMapping, markerParametersConfig, sidebarItems, lineWeightMap, binarySearch} from './utils/constants';
import 'leaflet-polylinedecorator';
import {mapCenter, iconMapping, markerParametersConfig, defVal, sidebarItems} from './utils/constants';
import Search from './interface-elements/Search';
import Sidebar from './interface-elements/Sidebar';
import RunButton from './interface-elements/RunButton';
import LockButton from './interface-elements/LockButton';
import DeleteButton from './interface-elements/DeleteButton';
import ReverseButton from './interface-elements/ReverseButton';
import WaitingOverlay from './interface-elements/WaitingOverlay';
import {PolylineDecorator} from './interface-elements/PolylineDecorator';

export function ReactApp() {
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);
    const markerRefs = useRef([]);
    const lineRefs = useRef([]);
    // line = [pos1, pos2, color, low/high, [busLine]]
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

    const findMarkerById = (id) => {
        return binarySearch(markers, id, 0, markers.length - 1);
    }

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

            for (const key in parameters)
                parameters[key] = defaultValues[draggedItem.type][key]

            let markerId = 0;
            if (markers.length != 0) {
                markerId = markers[markers.length - 1].id + 1;
            }
            // Add the dropped item as a marker on the map
            const newMarker = {id: markerId,
                position: droppedLatLng,
                name: draggedItem.name,
                icon,
                type: draggedItem.type,
                parameters,
                color: '#000'
            };
            

            if (newMarker.name === "Transformer") {
                newMarker.connections = 0;
                newMarker.high = null;
                newMarker.low = null;
            }
            setMarkers([...markers, newMarker]);
        }
        setDraggedItem(null);
    };

    const handleMarkerClick = (event, markerId) => {
        const targetMarker = event.target;
        if (targetMarker) {
            targetMarker.closePopup();
        }
        if (selectedMarker === null) {
            setSelectedMarker(markerId);
        } else {
            let selected = findMarkerById(selectedMarker);
            let current = findMarkerById(markerId);
            if (selectedMarker !== markerId && (selected.icon.options.id === "bus" || current.icon.options.id === "bus")) {
                if (selected && current) {
                    // Logic for creating lines between markers
                        let color = "#358cfb";
                        if(selected.icon.options.id === "bus" && current.icon.options.id === "bus") color = "#000"
                    if (lines.length === 0 || lines[lines.length - 1].length === 5) {
                        let newLine = [selected.position, current.position,  color, 'none', [selected.id, current.id].sort()];
                        //const newLine = [markers[selectedMarker].position, markers[markerIndex].position];
                        const newBusLine = [selected.id, current.id].sort();
                        let found = false;
                        for (let i = 0; i < busLines.length; i++) {
                            const item = busLines[i];
                            if (item[0] === newBusLine[0] && item[1] === newBusLine[1]) {
                                found = true;
                                break;
                            }
                        }
                        let maxTransformer = false;
                        // Check for transformer constraints
                        if (selected.name === "Transformer") {
                            if (selected.connections >= 2) {
                                maxTransformer = true;
                            } else {
                                if (selected.high === null) {
                                    selected.high = markerId;
                                    newLine[3] = 'high';
                                } else if (selected.low === null) {
                                    selected.low = markerId;
                                    newLine[3] = 'low';
                                }
                                selected.connections++;
                            }
                        } else if (current.name === "Transformer") {
                            if (current.connections >= 2) {
                                maxTransformer = true;
                            } else {
                                if (current.high === null) {
                                    current.high = selectedMarker
                                    newLine[3] = 'high';
                                } else if (current.low === null) {
                                    current.low = selectedMarker
                                    newLine[3] = 'low';
                                }
                                current.connections++;
                            }
                        }

                        // Add line if it doesn't exist and doesn't break transformer constraints
                        if (!found && !maxTransformer){
                            setLines([...lines, newLine]);
                            setBusLines([...busLines, newBusLine]);
                            lineRefs.current.push(newLine);
                        }
                    } else {
                        const newLine = [[selected.position, current.position],  '#000'];
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
        const oldMarkerId = markers[indexMarker].id;
        const markerRef = markerRefs.current[indexMarker];
        if (markerRef) {
            markerRef.closePopup();
        }
        const updatedMarkers = markers.map(marker => {
            if (marker.name === "Transformer") {
                const c = marker.connections;
                if (marker.low === oldMarkerId) {
                    return {...marker, low: null, connections: c-1};
                } else if (marker.high === oldMarkerId) {
                    return {...marker, high: null, connections: c-1};
                }
            }
            return marker;
        });
        updatedMarkers.splice(indexMarker, 1);
        console.log(updatedMarkers);
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

    const handleTransReverse = (markerId) => {
        const marker = findMarkerById(markerId);
        const [newHigh, newLow] = [marker.low, marker.high];
        const updatedMarkers = markers.map(marker => {
            if (marker.id === markerId) {
                return {
                    ...marker,
                    high: newHigh,
                    low: newLow
                };
            }
            return marker;
        });
        setMarkers(updatedMarkers);

        
        const updatedLines = lines.map(line => {
            if(line[0] === marker.position || line[1] === marker.position) {
                return line.map(point => {
                    if (point === 'high') {
                        return 'low';
                    } else if (point === 'low') {
                        return 'high';
                    }
                    return point;
                });
            }
            return line;
        })
        

        setLines(updatedLines);
    }

    const handleLineDelete = (index) => {
        const lineRef = lineRefs.current[index];
        const oldBusLine = busLines[index];
        if (lineRef) {
            lineRef.closePopup();
        }
        const updatedLines = [...lines.slice(0, index), ...lines.slice(index + 1)];
        const updatedBusLines = [...busLines.slice(0, index), ...busLines.slice(index + 1)];

        const marker1 = findMarkerById(oldBusLine[0]);
        const marker2 = findMarkerById(oldBusLine[1]);
        let oldMarkerId = null;
        if (marker1.name === "Transformer" || marker2.name === "Transformer") {
            if (marker1.name === 'Transformer') oldMarkerId = marker2.id;
            else oldMarkerId = marker1.id;

            const updatedMarkers = markers.map(marker => {
                if (marker.name === "Transformer") {
                    const c = marker.connections;
                    if (marker.low === oldMarkerId) {
                        return {...marker, low: null, connections: c-1};
                    } else if (marker.high === oldMarkerId) {
                        return {...marker, high: null, connections: c-1};
                    }
                }
                return marker;
            });

            setMarkers(updatedMarkers);
        }

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

    const renderRequiredButtons = (marker, index) => {
        const { id, type } = marker;
        if (type === 'trafo1') {
            return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginBottom: '5px'}}>
                <DeleteButton onClick={() => handleMarkerDelete(index)}/>
            </div>
            <div style={{marginBottom: '5px'}}>
                <ReverseButton onClick={() => handleTransReverse(index)}/>
            </div>
            </div>
            );
        }
        return (
            <div style={{marginBottom: '5px'}}>
                <DeleteButton onClick={() => handleMarkerDelete(index)}/>
            </div>
        )
    }

    const handleParameterChange = (markerId, paramName, value) => {
        if(value !== null && value !== 0 && value !== '')
        {
            const newValues = {
                ...defaultValues,
                [markers[markerId].type]: {...defaultValues[markers[markerId].type], [paramName]: value}
            }
            setDefaultValues(newValues)
        }
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
            <Sidebar handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} iconMapping={iconMapping} sidebarItems={sidebarItems} />
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
                                        click: (e) => handleMarkerClick(e, marker.id),
                                        contextmenu: (e) => handleMarkerRightClick(e),
                                        dragstart: () => setSelectedMarker(null),
                                        drag: (e) => handleMarkerDrag(index, e.target.getLatLng()),
                                    }}
                            >
                                <Popup>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ marginBottom: '5px' }}>{marker.name}</div>
                                        {renderParameterInputs(marker)}
                                        {renderRequiredButtons(marker, index)}
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
                        <PolylineDecorator lines = {lines} markers = {markers}> </PolylineDecorator>
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