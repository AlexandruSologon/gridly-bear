import './css-files/index.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';
import debounce from 'lodash.debounce';
import { message, ConfigProvider, Slider } from "antd";
import React, {useState, useRef} from 'react';
import { MapContainer, Marker, Polyline, ZoomControl } from 'react-leaflet';

import Tile from "./interface-elements/Tile";
import Sidebar from './interface-elements/Sidebar';
import LineSettings from "./interface-elements/LineSettings";
import ToolElements from './interface-elements/ToolElements';
import MarkerSettings from "./interface-elements/MarkerSettings";
import WaitingOverlay from './interface-elements/WaitingOverlay';
import PolylineDecorator from './interface-elements/PolylineDecorator';
import Scale from './interface-elements/Scale';

import {
    defVal,
    mapCenter,
    sidebarItems,
    lineDefaultColor,
    connectionDefaultColor,
    markerParametersConfig, resultIcon,
} from './utils/constants';
import {iconMapping} from './utils/iconMapping'
import { resetLinesRender, resetMarkerRender, findMarkerById } from './utils/api';
import 'leaflet-polylinedecorator';
import HistoryDrawer from './interface-elements/HistoryDrawer';


export function ReactApp() {
    document.title = "GridlyBear";
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);
    const markerRefs = useRef([]);
    const lineRefs = useRef([]);
    const [lines, setLines] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isMapLocked, setIsMapLocked] = useState(true);
    const [runClicked, setRunClicked] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [defaultValues, setDefaultValues] =  useState(defVal);
    const [messageApi, contextHolder] = message.useMessage();
    const [mapOpacity, setMapOpacity] = useState(1);
    const [isHistoryOn, setIsHistoryOn] = useState(false);
    const [history, setHistory] = useState([]);
    const [highlightedMarker, setHighlightedMarker] = useState(null);
    

    const handleDragStart = (event, item) => {
        setDraggedItem(item);
    };

    const handleDragEnd = () => {
        let flag = false;
            for (const key in defaultValues[draggedItem.type]){
            if( defaultValues[draggedItem.type][key] === null) {
                flag = true;
            }
            }
            if(flag && markers.length>0) {markerRefs.current[markers.length-1].openPopup() }
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
                acc[param.name] = '';
                return acc;
            }, {}) : {};

            for (const key in parameters)
                parameters[key] = defaultValues[draggedItem.type][key]

            let markerId = 0;
            if (markers.length !== 0) {
                markerId = markers[markers.length - 1].id + 1;
            }
            // Add the dropped item as a marker on the map
            const newMarker = {id: markerId,
                position: droppedLatLng,
                name: draggedItem.name,
                icon,
                type: draggedItem.type,
                parameters,
            };
            console.log(newMarker.parameters)

            if (newMarker.name === "Transformer") {
                newMarker.connections = 0;
                newMarker.high = null;
                newMarker.low = null;
                newMarker.transformerType = defaultValues.trafo1.type
            }

            if (newMarker.type === "battery") {
                newMarker.isGen = defaultValues.battery.isGen;
            }

            resetMarkerRender(markers,markerRefs)
            setLines(resetLinesRender(lines,markers))
            setMarkers([...markers, newMarker]);

        }
    };

    const handleMarkerClick = (event, markerId) => {
        const targetMarker = event.target;
        if (targetMarker) {
            targetMarker.closePopup();
        }

        //resetting style of prev marker if a new marker is clicked
        if (highlightedMarker !== null && markerRefs.current[highlightedMarker]) {
            markerRefs.current[highlightedMarker]._icon.style.filter = '';
        }

        //setting current marker
        setHighlightedMarker(markerId);

        //giving correct style to selected marker
        if (markerRefs.current[markerId]) {
            markerRefs.current[markerId]._icon.style.filter = 'brightness(1.5)';
        }

        if (selectedMarker === null) {
            setSelectedMarker(markerId);
        } else {
            let selected = findMarkerById(selectedMarker, markers);
            let current = findMarkerById(markerId, markers);
            if (selectedMarker !== markerId && (selected.type === "bus" || current.type === "bus")) {
                if (selected && current) {
                    // Logic for creating lines between markers
                        let color = connectionDefaultColor;
                        let connection = "direct";
                        let type = null;
                        if (selected.type === "bus" && current.type === "bus") {
                            color = lineDefaultColor
                            connection = "electrical"
                            type = defaultValues.line.type
                        }
                        let newLine = {
                            position1: selected.position,
                            position2: current.position,
                            type: type,
                            color: color,
                            // ID of start marker and end marker sorted
                            busLine: [selected.id, current.id].sort(),
                            arrow: 'none',
                            connection: connection,
                            length: selected.position.distanceTo(current.position)/1000,
                            value: null
                        };
                        console.log(newLine);
                        const sameLines = lines.filter(line =>
                            (line.busLine[0] === newLine.busLine[0] && line.busLine[1] === newLine.busLine[1]));
                        
                        // Check for one direct connection per component
                        let componentLine = false;
                        if(connection === "direct") {
                            let componentId = selectedMarker;
                            let transformer = selected.name === "Transformer";
                            if (selected.type === "bus") {
                                componentId = markerId;
                                transformer = current.name === "Transformer";
                            }
                            const sameComponent = lines.filter(line =>
                                (line.busLine[0] === componentId || line.busLine[1] === componentId));

                            componentLine = !transformer && sameComponent.length > 0;
                        }

                        const found = sameLines.length !== 0;
                        let maxTransformer = false;
                        // Check for transformer constraints
                        if (selected.name === "Transformer") {
                            if (selected.connections >= 2) {
                                maxTransformer = true;
                            } else {
                                if (selected.high === null) {
                                    selected.high = markerId;
                                    newLine.arrow = 'high';
                                } else if (selected.low === null) {
                                    selected.low = markerId;
                                    newLine.arrow = 'low';
                                }
                                selected.connections++;
                            }
                        } else if (current.name === "Transformer") {
                            if (current.connections >= 2) {
                                maxTransformer = true;
                            } else {
                                if (current.high === null) {
                                    current.high = selectedMarker
                                    newLine.arrow = 'high';
                                } else if (current.low === null) {
                                    current.low = selectedMarker
                                    newLine.arrow = 'low';
                                }
                                current.connections++;
                            }
                        }

                        // Add line if it doesn't exist and doesn't break transformer constraints
                        if (!(found || maxTransformer || componentLine)){
                            setLines([...lines, newLine]);

                        }
                    } else {
                        const newLine = [[selected.position, current.position],  '#000'];
                        setLines([...lines.slice(0, lines.length - 1), newLine]);
                    }
            }
            setSelectedMarker(null);
            setHighlightedMarker(null);
            //resetting style of prev marker if a new marker is clicked
            if (highlightedMarker !== null && markerRefs.current[highlightedMarker]) {
                markerRefs.current[highlightedMarker]._icon.style.filter = '';
            }
        }
    };

    const handleMarkerDrag = debounce((markerId, newPosition) => {
        const oldPosition = findMarkerById(markerId, markers).position;
        const updatedMarkers = markers.map(marker => {
            if (marker.id === markerId) {
                return { ...marker, position: newPosition };
            }
            return marker;
        });

        const updatedLines = lines.map(line => {
            const lineRef = lineRefs.current[lines.indexOf(line)];
            if (lineRef) lineRef.closePopup();

            if (line.position1.lat === oldPosition.lat && line.position1.lng === oldPosition.lng) {
                return {...line, position1: newPosition, length: line.position2.distanceTo(newPosition)/1000};
            } else if (line.position2.lat === oldPosition.lat && line.position2.lng === oldPosition.lng) {
                return {...line, position2: newPosition, length: line.position1.distanceTo(newPosition)/1000};
            } else {
                return line;
            }
        })

        setMarkers(updatedMarkers);
        resetMarkerRender(updatedMarkers, markerRefs)
        setLines(resetLinesRender(updatedLines, updatedMarkers));
    }, 100);

    const handleMarkerDelete = (markerId) => {
        const oldMarker = findMarkerById(markerId, markers);
        const oldMarkerPos = oldMarker.position;
        const oldMarkerId = oldMarker.id;
        const markerRef = markerRefs.current[markers.indexOf(oldMarker)];
        if (markerRef) {
            const style = markerRef.valueOf()._icon.style;
            if(markerRef.options.type !== 'bus') {
                style.border = ''
                style.borderWidth = ''
            }
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
        updatedMarkers.splice(markers.indexOf(oldMarker), 1);
        setMarkers(updatedMarkers);

        if (selectedMarker === markerId) {
            setSelectedMarker(null);
        }
        const updatedLines = lines.filter(line => 
            !((line.position1.lat === oldMarkerPos.lat && line.position1.lng === oldMarkerPos.lng) ||
            (line.position2.lat === oldMarkerPos.lat && line.position2.lng === oldMarkerPos.lng)));
        setLines(resetLinesRender(updatedLines, updatedMarkers));
        resetMarkerRender(markers, markerRefs)

    };

    const handleMarkerHover = (markerId, isHovered) => {
        if (markerId && markerId._icon) {
            if (isHovered) {
                markerId._icon.style.filter = 'brightness(1.5)';
            } else {
                markerId._icon.style.filter = '';
            }
        }
    };

    const handleTransReverse = (markerId) => {
        const marker = findMarkerById(markerId, markers);
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
            if(line.position1 === marker.position || line.position2 === marker.position) {
                if (line.arrow === "high") return {...line, arrow: "low"};
                if (line.arrow === "low") return {...line, arrow: "high"};
            }
            return line;
        })

        setLines(updatedLines);
        resetMarkerRender(updatedMarkers, markerRefs);
        resetLinesRender(updatedLines, updatedMarkers);
    }

    const handleLineDelete = (index) => {
        const lineRef = lineRefs.current[index];
        const oldBusLine = lines[index].busLine;
        if (lineRef) {
            lineRef.closePopup();
        }
        const updatedLines = [...lines.slice(0, index), ...lines.slice(index + 1)];

        const marker1 = findMarkerById(oldBusLine[0], markers);
        const marker2 = findMarkerById(oldBusLine[1], markers);
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
        setLines(updatedLines);
        lineRefs.current.splice(index, 1);
    };

    const handleMarkerRightClick = (event) => {
        event.originalEvent.preventDefault();
        const targetMarker = event.target;
        if (targetMarker && targetMarker.getPopup()) {
            targetMarker.openPopup();
        }
    };

    const handleLineClick = (event) => {
        const targetLine = event.target;
        if (targetLine) {
            targetLine.closePopup();
        }
    };

    const handleLineRightClick = (event) => {
        event.originalEvent.preventDefault();
        const targetLine = event.target;
        if (targetLine && targetLine.getPopup()) {
            targetLine.openPopup();
        }
    };

    const handleParameterChange = (markerId, paramName, value) => {

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
        setLines(resetLinesRender(lines,markers))
        setMarkers(updatedMarkers);
        resetMarkerRender(updatedMarkers, markerRefs);
        
    };

    const changeLineLength = (line, value) => {
        console.log(value)
        setLines(lines.map(l => {if (l.busLine[1] === line.busLine[1] && l.busLine[0] === line.busLine[0]) return {...l, length: value}; else return l}));
        console.log(lines)
    }

    const replaceDefaultValues = (component, isLine) => {
        if(!isLine) {
        let newValue = defaultValues;
        for(const key in component.parameters) {
            const paramName = key;
            const value = component.parameters[key];
            if(value !== null && value !== 0 && value !== '')
        {
             newValue = {
                ...newValue,
                [component.type]: {...newValue[component.type], [paramName]: value}
            };
        }}
        setDefaultValues(newValue);
    }
        else {
            const newValue = {...defaultValues, 'line': defaultValues['line'], 'type':component.type }
            setDefaultValues(newValue)
        }
    }

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
            <ConfigProvider theme={{ token: { colorPrimary: '#193165' } }}>
                <Slider defaultValue={100} style={{width:200, position:'absolute', zIndex: 1001, left:'50vw', translate: '-50%', bottom:15}} onChange={(e) => setMapOpacity(e/100)} />
            </ConfigProvider>
            <div
                style={{
                    position: 'relative',
                    flex: '1',
                    height: '100%',
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
                                        replaceDefaultValues = {replaceDefaultValues}/>
                                </Marker>))}
                        {lines.filter(x => x.value !== null).map((line,index) => (
                            <Marker key={index}
                                            draggable={false}
                                            clickable={false}
                                            icon={resultIcon(line)}
                                            interactive={false}
                                            // These offsets should depend on line length / Camera zoom level
                                            position={[(line.position1.lat + line.position2.lat)/2, (line.position1.lng + line.position2.lng)/2]}
                    />))}
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
                                    <LineSettings line={line} index={index} handleLineDelete={handleLineDelete} markers={markers} lines={lines} markerRefs={markerRefs} setLines={setLines} replaceDefaultValues={replaceDefaultValues} changeLineLength={changeLineLength}></LineSettings>
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
                                setDraggedItem={setDraggedItem}
                                setSelectedMarker={setSelectedMarker}
                                setDefaultValues = {setDefaultValues}
                        ></ToolElements>
                        <Scale />
                        </MapContainer>
                        {contextHolder}
                </div>
            </div>
        </div>
    );
}

export default ReactApp;