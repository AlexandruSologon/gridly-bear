import React, {useState, useRef, useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import './index.css';
import 'reactflow/dist/style.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet';
import Search from './Search';
import debounce from "lodash.debounce";
import { cnvs_json_post } from './api_interaction';
import {Network,Bus, Load, Transformer, Line, ExtGrid, Generator} from './CoreClasses';
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


function ReactApp() {
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);
    const markerRefs = useRef([]);
    const lineRefs = useRef([]);
    const [lines, setLines] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isMapLocked, setIsMapLocked] = useState(true);
    const [busLines, setBusLines] = useState([]);

    // TODO: user's input address -> translated to latitude and longitude (hardcode for now)
    const mapCenter = [51.91145215945188, 4.478236914116433];

    // TODO: in case of needing to change the below icons for the sake of design,
    //  iconAnchor = [width/2, height/2] (width, height = dimension of image)
    const solarIcon = new L.icon({
        id: 'solar',
        iconRetinaUrl: require('./images/solar.png'),
        iconUrl: require('./images/solar.png'),
        iconAnchor: [35, 35],
        popupAnchor:[0, -35]
    });
    const busIcon = new L.icon({
        id: 'bus',
        iconRetinaUrl: require('./images/Blank.png'),
        iconUrl: require('./images/bus.png'),
        iconAnchor: [32, 32],
        popupAnchor:[0, -35],
        className: 'dot'
    });
    const gridIcon = new L.icon({
        id: 'grid',
        iconRetinaUrl: require('./images/power (2).png'),
        iconUrl: require('./images/power (2).png'),
        iconAnchor: [32,32],
        popupAnchor:[0, -35]
    });
    const loadIcon = new L.icon({
        id: 'load',
        iconRetinaUrl: require('./images/house.png'),
        iconUrl: require('./images/house.png'),
        iconAnchor: [32, 32],
        popupAnchor: [0, -32]
    });
    const windIcon = new L.icon({
        id: 'wind',
        iconRetinaUrl: require('./images/wind.png'),
        iconUrl: require('./images/wind.png'),
        iconAnchor: [42.5, 42.5],
        popupAnchor:[0, -42.5]
    });
    const trafo1Icon = new L.icon({
        id: 'trafo1',
        iconRetinaUrl: require('./images/Blank.png'),
        iconUrl: require('./images/wind.png'),
        iconAnchor: [32, 32],
        popupAnchor:[0, -42.5],
        className: 'dot'
    });
    const trafo2Icon = new L.icon({
        id: 'trafo2',
        iconRetinaUrl: require('./images/Blank.png'),
        iconUrl: require('./images/wind.png'),
        iconAnchor: [32, 32],
        popupAnchor:[0, -42.5],
        className: 'dot'
    });

    const iconMapping = {
        grid: gridIcon,
        solar: solarIcon,
        bus: busIcon,
        load: loadIcon,
        wind: windIcon,
        trafo1: trafo1Icon,
        trafo2: trafo2Icon,
    };

    const sidebarItems = [
        { id: 1, name: 'Solar Panel', type: 'solar' },
        { id: 2, name: 'Bus', type: 'bus' },
        { id: 3, name: 'Load', type: 'load' },
        { id: 4, name: 'Wind Turbine', type: 'wind'},
        { id: 5, name: 'Transformer', type: 'trafo1' },
        { id: 6, name: 'External Grid', type: 'grid' },
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
                        components.push(new ExtGrid(indices[6], busIndex, parseFloat(item1.parameters.voltage)));
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
                parameters
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
            if (selectedMarker !== markerIndex) {
                // Check if both markers still exist
                if (markers[selectedMarker] && markers[markerIndex]) {
                    // Logic for creating lines between markers
                    if (lines.length === 0 || lines[lines.length - 1].length === 3) {
                        const newLine = [markers[selectedMarker].position, markers[markerIndex].position,  '#000'];
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
        console.log(markers[indexMarker].icon.options.id);
        if(markers[indexMarker].icon.options.id === 'trafo1')
        updatedMarkers.splice(indexMarker, 2);
        else
        if(markers[indexMarker].icon.options.id === 'trafo2')
            updatedMarkers.splice(indexMarker - 1, 2);
        else
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
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable()}
        return isMapLocked
    }
    const MapEvents =() => {
    const map = useMapEvents({
    zoom() {
      for (let i=0; i < markers.length; i++)
                    if (markers[i].icon.options.id === 'trafo1')
                        handleMarkerDrag(i, markers[i].position)
  },}

  )
    }

    /**
     * Runs when the green run button is clicked,
     * will send and receive data from the server/fb_functions API
     */
    var run_was_clicked = false;
    const onRunButtonClick = () => {
        if(run_was_clicked) return;
        run_was_clicked = true;

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
                renderSomething(data)
            }
        }).catch((error) => {
            console.log(error.message + " : " +  error.details);
            alert("Error showing results");
        }).finally(() => {
            run_was_clicked = false;
        });
    }

    const renderSomething = (data) => {
        let nr = -1;
        const uL = lines.map((line) =>  {
            if(markers[busLines[lines.indexOf(line)][0]].name === markers[busLines[lines.indexOf(line)][1]].name)
            {   nr++
                return [line[0],line[1],data.lines[nr]]}
            else return line
            }
        );
        setLines(uL) ;


    };



    const zip = (a, b) => a.map((k, i) => [k, b[i]])

    return (
        <div style={{height: '100vh'}}>
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
                        //maxZoom={20}
                        minZoom={3}
                        style={{width: '100%', height: '100%', zIndex: 0, opacity: 1}}
                        zoomControl={false}
                        attributionControl={false}
                    >

                        <Search style={{left: '400px'}}/>
                        {/* TODO: Opacity of TitleLayer can be changed to 0 when user want a blank canvas */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            opacity={0.7}
                        />
                        <MapEvents/>
                        {markers.map((marker, index) => (
                            <Marker key={index}
                                    position={marker.position}
                                    icon={marker.icon}
                                    draggable={true}
                                    clickable={true}
                                    ref={(ref) => (markerRefs.current[index] = ref)}
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
                                        <IconButton aria-label="check" style={{
                        position: 'absolute',
                        right: '0px',
                        top: '78%',
                        width: '8vw',
                        height: '8vw',
                        opacity: '70'
                    }} onClick={onRunButtonClick}>
                        <PlayArrowTwoToneIcon className="PlayArrowTwoToneIcon" style={{
                            width: '8vw',
                            height: '8vw',
                            color: '#05a95c',
                            borderWidth: '1px',
                            borderColor: '#000',
                            opacity: '70'
                        }}/>

                    </IconButton>

                </div>
            </div>
        </div>
    );
}

export default ReactApp;
