import React, {useState, useRef} from 'react';
import './index.css';
import 'reactflow/dist/style.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet';
import Search from './Search';
import debounce from "lodash.debounce";
import { cnvs_json_post } from './api_interaction';
import {Network,Bus, Load, Line, ExtGrid, Generator} from './CoreClasses';
import WaitingOverlay from './waitingOverlay'
import RunButton from './runButton';
import Sidebar from "./Sidebar";
import LockButton from "./LockButton";

function DeleteButton({ onClick }) {
    return (
        <button style={{ color: 'red' }} onClick={onClick}>
            Delete
        </button>
    );
}

function Address() {
    return (
        <input type="text" placeholder="Search for Components">
        </input>
    );
}


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
    const [lineColors, setLineColors] = useState([]);

    // TODO: user's input address -> translated to latitude and longitude (hardcode for now)
    const mapCenter = [51.91145215945188, 4.478236914116433];

    // TODO: in case of needing to change the below icons for the sake of design,
    //  iconAnchor = [width/2, height/2] (width, height = dimension of image)
    // const makeIcon = (marker) => {
    //     if (marker.name === 'Bus') {
    //         console.log(marker.icon);
    //         return marker.icon;
    //     }
    //
    //     else return marker.icon;
    //}
    const solarIcon = new L.icon({
        id: 'solar',
        iconRetinaUrl: require('./images/solarPanel.png'),
        iconUrl: require('./images/solarPanel.png'),
        iconAnchor: [30, 25],
        popupAnchor:[0, -35],
        iconSize: [60, 50]
    });
    const busIcon = new L.icon({
        id: 'bus',
        iconUrl: require('./images/Blank.png'),
        iconRetinaUrl: require('./images/busIcon.png'),
        iconAnchor: [24, 24],
        popupAnchor:[0, -32],
        iconSize: [48, 48],
        className: 'dot ',

    });
    const gridIcon = new L.icon({
        id: 'grid',
        iconRetinaUrl: require('./images/grid.png'),
        iconUrl: require('./images/grid.png'),
        iconAnchor: [32,32],
        popupAnchor:[0, -32],
        iconSize: [80, 80]
    });
    const loadIcon = new L.icon({
        id: 'load',
        iconRetinaUrl: require('./images/load.png'),
        iconUrl: require('./images/load.png'),
        iconAnchor: [32, 28.5],
        popupAnchor: [0, -32],
        iconSize: [64, 57]
    });
    const windIcon = new L.icon({
        id: 'wind',
        iconRetinaUrl: require('./images/windTurbine.png'),
        iconUrl: require('./images/windTurbine.png'),
        iconAnchor: [35, 35],
        popupAnchor: [0, -35],
        iconSize: [70, 70]
    });
    const trafo1Icon = new L.icon({
        id: 'trafo1',
        iconRetinaUrl: require('./images/energy.png'),
        iconUrl: require('./images/energy.png'),
        iconAnchor: [32, 32],
        popupAnchor: [0, -32],
        iconSize: [64, 64]
    });

    const iconMapping = {
        grid: gridIcon,
        solar: solarIcon,
        bus: busIcon,
        load: loadIcon,
        wind: windIcon,
        trafo1: trafo1Icon
    };
    const busColor = (index) => markers[index][3];

    const sidebarItems = [
        { id: 1, name: 'Wind Turbine', type: 'wind' },
        { id: 2, name: 'Solar Panel', type: 'solar' },
        { id: 3, name: 'Load', type: 'load' },
        { id: 4, name: 'Transformer', type: 'trafo1' },
        { id: 5, name: 'External Grid', type: 'grid' },
        { id: 6, name: 'Bus', type: 'bus'}
    ];

    // TODO: Change parameter names and/or add more parameters here if necessary
    const markerParametersConfig = {
        bus: ['voltage'],
        //line: ['type', 'length'], // not a marker
        transformer: ['type'],
        switch: ['type'],
        load: ['p_mv', 'q_mvar'],
        extGrid: ['voltage'],
        solar: ['power'],
        wind: ['power']
    }

    const [draggedItem, setDraggedItem] = useState(null);

    const handleExport = (markerInputs) => {
        const buses = [];
        const components = [];
        let indices = [0, 0, 0, 0, 0, 0, 0];
        const busIdMap = new Map();

        markerInputs.forEach((marker) => {
            if(marker.name === "Bus")
            {
                const busIndex = indices[0];
                indices[0] += 1;
                let newBus;
                if (busIndex === 0) newBus = new Bus(busIndex, marker.position, parseFloat(marker.parameters.voltage));
                else newBus = new Bus(busIndex, marker.position, parseFloat(marker.parameters.voltage));
                buses.push(newBus);
                busIdMap.set(marker.id, busIndex);
            }
        })


        for (let i = 0; i < busLines.length; i++) {
            const line = busLines[i];
            //const bus1Loc = markers[line[0]].getLatLng();
            //const bus2Loc = markers[line[1]].getLatLng();
            let item1 = markers[line[0]]
            let item2 = markers[line[1]]
            if (item1.name === 'Bus' && item2.name === 'Bus') {
                components.push(new Line(indices[1],busIdMap.get(line[0]), busIdMap.get(line[1]), item1.position.distanceTo(item2.position)/1000, 'NAYY 4x50 SE'));
                indices[1] += 1;
            } else if (item1.name === 'Bus' ^ item2.name === 'Bus'){
                if (item1.name === 'Bus') {
                    [item1,item2] = [item2, item1];
                }
                const busIndex = busIdMap.get(item2.id);
                switch(item1.name) {
                    case 'Load':
                        components.push(new Load(indices[2], busIndex, parseFloat(item1.parameters.p_mv), parseFloat(item1.parameters.q_mvar)));
                        indices[2] += 1;
                        break;
                    case 'Solar Panel':
                    case 'Wind Turbine':
                        components.push(new Generator(indices[3], busIndex, parseFloat(item1.parameters.power)));
                        indices[3] += 1;
                        break;
                    case 'External Grid':
                        components.push(new ExtGrid(indices[6], busIndex, 1.2));
                        indices[6] += 1;
                        break;
                    /*
                    case 'Transformer':
                        components.push(new Transformer(indices[4], busIndex, 5, 20));
                        indices[4] +=1;
                        break;
                        */
                    default:
                        break;
                }
            }
        }

        const total = buses.concat(components);
        const networkData = JSON.stringify(new Network(total));
        console.log('Exported Data:', networkData);
        return networkData;
    };

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
            // Get the icon for the dragged item based on its type
            const icon = iconMapping[draggedItem.type];
            // Configure the parameters according to the right marker type
            const parametersConfig = markerParametersConfig[draggedItem.type];
            const parameters = parametersConfig ? parametersConfig.reduce((acc, param) => {
                acc[param] = '';
                return acc;
            }, {}) : {};
            // Add the dropped item as a marker on the map
            const newMarker = {id: markers.length,
                position: droppedLatLng,
                name: draggedItem.name,
                icon,
                type: draggedItem.type,
                parameters,
                color: '#000'
            };
            setMarkers([...markers, newMarker]);
        }
        setDraggedItem(null);};

    const handleMarkerClick = (event, markerIndex) => {
        const targetMarker = event.target;
        if (targetMarker) {
            targetMarker.closePopup();
        }
        // If no marker is currently selected, set the clicked marker as selected
        if (selectedMarker === null) {
            setSelectedMarker(markerIndex);
        } else {
            // If another marker is already selected
            if (selectedMarker !== markerIndex && (markers[selectedMarker].icon.options.id === "bus" || markers[markerIndex].icon.options.id === "bus")) {
                // Check if both markers still exist
                if (markers[selectedMarker] && markers[markerIndex]) {
                    // Logic for creating lines between markers
                        let color = "#358cfb";
                        if(markers[selectedMarker].icon.options.id === "bus" && markers[markerIndex].icon.options.id === "bus") color = "#000"
                    if (lines.length === 0 || lines[lines.length - 1].length === 3) {
                        const newLine = [markers[selectedMarker].position, markers[markerIndex].position,  color];
                        //const newLine = [markers[selectedMarker].position, markers[markerIndex].position];
                        const newBusLine = [markers[selectedMarker].id, markers[markerIndex].id].sort();
                        let found = false;
                        // Check if line already exists
                        for (let i = 0; i < busLines.length; i++) {
                            const item = busLines[i];
                            if (item[0] === newBusLine[0] && item[1] === newBusLine[1]) {
                                found = true;
                                break;
                            }
                        }
                        // Add line if it doesn't exist
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
            // Unselect the marker regardless of the action taken
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

        const updatedLines = lines.map(
            line => { return line.map(point  => {
                if (point === markers[markerIndex].position && (point === line[0] || point === line[1])) {
                    return newPosition;
                }
                return point;
            });
        });

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
        const updatedLines = lines.filter((line) => {
            // Check if the line contains the deleted marker's position
            return !(line[0] === oldMarkerPos || line[1] === oldMarkerPos);
            });
        setLines(updatedLines);

        const updatedBusLines = busLines.filter((line) => {
            // Check if the line contains the deleted marker's position
            return !(line[0] === indexMarker || line[1] === indexMarker);
        });
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

        return (
            parameterFields.map((param) => (
                <div key={param} style={{ marginBottom: '5px' }}>
                    <input
                        type="text"
                        placeholder={param.charAt(0).toUpperCase() + param.slice(1)}
                        value={parameters[param] || ''}
                        onChange={(e) => handleParameterChange(id, param, e.target.value)}
                    />
                </div>
            ))
        );
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
        setIsMapLocked(!isMapLocked)
        const map = mapContainer.current;
        if(isMapLocked) {map.dragging.disable();
            map.keyboard.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable()}
        else {map.dragging.enable();
            map.keyboard.enable();
            //map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable()}
        return isMapLocked
    }

    /**
     * Runs when the green run button is clicked,
     * will send and receive data from the server/fb_functions API
     */
    
    const onRunButtonClick = () => {
        if(runClicked) return;
        setRunClicked(true);
        setIsMapLocked(true);

        const markerInputs = markers.map(marker => ({
            id: marker.id,
            type: marker.type,
            parameters: marker.parameters,
            name: marker.name
        }));

        const dat = handleExport(markerInputs);
        console.log('Sent over Data:', dat);
        cnvs_json_post(dat)
        .then((data) => {
            if(data === null) {
                return;
            } else {
                alert("Results: " + JSON.stringify(data));
                renderLines(data)
                renderBuses(data)
            }
        }).catch((error) => {
            console.log(error.message + " : " +  error.details);
            alert("Error showing results");
        }).finally(() => {
            setRunClicked(false);
        });
    }

    const renderLines = (data) => {
        let nr = -1;
        const uL = lines.map((line) =>  {
            if(markers[busLines[lines.indexOf(line)][0]].name === markers[busLines[lines.indexOf(line)][1]].name)
            {   nr++
                return [line[0],line[1],'hsl('+data.lines[nr][0]+','+data.lines[nr][1]+'%,'+data.lines[nr][2]+'%)']}
            else return line
            }
        );
        setLines(uL) ;


    };

    const renderBuses = (data) => {
        let nr = 0;
        markerRefs.current.forEach(marker => {
            console.log(marker.valueOf()._icon.style.backgroundColor);
                if (marker.options.icon.options.id === "bus"){
           marker.valueOf()._icon.style.backgroundColor = '#fff'
           marker.valueOf()._icon.style.width = '48px'
           marker.valueOf()._icon.style.height = '48px'
           marker.valueOf()._icon.style.border = 'hsl('+data.buses[nr][0]+','+data.buses[nr][1]+'%,'+data.buses[nr][2]+'%)' + ' solid 6px'
           marker.valueOf()._icon.style.borderRadius = '50%'
           nr++; }})
    }


    return (
        <div style={{height: '100vh', width: '100vw'}}>
            <WaitingOverlay runClicked={runClicked}></WaitingOverlay>
            <Sidebar
                sidebarItems = {sidebarItems}
                handleDragStart = {handleDragStart}
                handleDragEnd = {handleDragEnd}
                iconMapping ={iconMapping}/>

            {/* Main Content */}
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
                {/* Map and other content */}
                <div style={{position: 'relative', flex: '1', height: '100%'}}>
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

                        <Search/>
                        {/* TODO: Opacity of TitleLayer can be changed to 0 when user want a blank canvas */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            opacity={0.4}
                        />
                        {markers.map((marker, index) => (
                            <Marker key={index}
                                    position={marker.position}
                                    icon={ marker.icon}
                                    draggable={true}
                                    clickable={true}
                                    ref={(ref) => (markerRefs.current[index] = ref)}
                                    className = "dot"
                                    eventHandlers={{
                                        click: (e) => handleMarkerClick(e, index),
                                        contextmenu: (e) => handleMarkerRightClick(e),
                                        // TODO: mouseover and mouseout are intended to change the mouse cursor when hovering over a component
                                        //  (to indicate users can create a line)
                                        //mouseover: () => handleMarkerHover(index),
                                        //mouseout: handleMarkerLeave,
                                        dragstart: () => setSelectedMarker(null),
                                        drag: (e) => handleMarkerDrag(index, e.target.getLatLng()),
                                    }}
                            >
                                <Popup>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <div style={{marginBottom: '5px'}}>{marker.name}</div>
                                        {renderParameterInputs(marker)}
                                        <div style={{marginBottom: '5px'}}>
                                            <DeleteButton onClick={() => handleMarkerDelete(index)}/>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {lines.map((line, index) => (
                            // TODO: color can be changed to indicate overload, for example: color={'red'}
                            <Polyline key={index}
                                      positions={[line[0],line[1]]}
                                      onMouseOver={e => e.target.openPopup()}
                                      onMouseOut={e => e.target.closePopup()}
                                      pathOptions = {{ color : line[2] }}
                                      clickable={true}
                                      weight={10}
                                      ref={(ref) => (lineRefs.current[index] = ref)}
                                      eventHandlers={{
                                          click: (e) => handleLineClick(e),
                                          contextmenu: (e) => handleLineRightClick(e)
                                      }}
                            >
                                <Popup>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{marginBottom: '5px'}}>{"Connection"}</div>
                                        <div style={{marginBottom: '5px'}}>
                                            <DeleteButton onClick={() => handleLineDelete(index)}/>
                                        </div>
                                    </div>
                                </Popup>
                            </Polyline>
                        ))}
                        <ZoomControl position="topright"/>
                    </MapContainer>
                    <LockButton onLockButtonClick={onLockButtonClick}/>
                    <RunButton runClicked={runClicked} onRunButtonClick={onRunButtonClick}></RunButton>
                </div>
            </div>
        </div>
    );
}

export default ReactApp;
