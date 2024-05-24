import React, { useState, useRef } from 'react';
import './index.css';
import 'reactflow/dist/style.css';
import 'leaflet/dist/leaflet.css';
import IconButton from '@mui/material/IconButton';
import {MapContainer, TileLayer, ZoomControl, Marker, Popup, Polyline, useMapEvents} from 'react-leaflet'
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import L from 'leaflet';
import {Network,Bus, Load, Transformer, Line, ExtGrid, Generator} from './CoreClasses';

function SubmitButton() {
    return (
        <input type="submit" name="Submit"/>
    );
}

function DeleteButton({ onClick }) {
    return (
        <button style={{ color: 'red' }} onClick={onClick}>
            Delete
        </button>
    );
}

function Parameter01() {
    return (
        <input type="text" placeholder="Parameter 1">
        </input>
    );
}

function Parameter02() {
    return (
        <input type="text" placeholder="Parameter 2">
        </input>
    );
}

function Parameter03() {
    return (
        <input type="text" placeholder="Parameter 3">
        </input>
    );
}

function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        alert(`You clicked ${item}`);
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative', marginBottom: '10px' }}>
            <button onClick={toggleMenu}>Open Dropdown</button>
            {isOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}>
                    <div onClick={() => handleItemClick('Item 1')}>Item 1</div>
                    <div onClick={() => handleItemClick('Item 2')}>Item 2</div>
                    <div onClick={() => handleItemClick('Item 3')}>Item 3</div>
                </div>
            )}
        </div>
    );
}

function Address() {
    return (
        <input type="text" placeholder="Address">
        </input>
    );
}

function ReactApp() {
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [lines, setLines] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState(null);
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
        { id: 5, name: 'External Grid', type: 'grid'},
        { id: 6, name: 'Transformer', type: 'trafo1'},
    ];

    const [draggedItem, setDraggedItem] = useState(null);

    const handleExport = () => {
        const buses = [];
        const components = [];
        const busIdMap = new Map();
        // Bus, Line, Load, Generator, Transformer, Switch, ExtGrid
        let indices = [0,0,0,0,0,0,0];

        markers.forEach((item) => {
            if (item.name === 'Bus') {
            const busIndex = indices[0];
            indices[0] += 1;
            const newBus = new Bus(busIndex, item.position, 5); //TODO Get voltage from some parameter variable
            buses.push(newBus);
            busIdMap.set(item.id, busIndex);
            }
        })

        for (let i = 0; i < busLines.length; i++) {
            const line = busLines[i];
            //const bus1Loc = markers[line[0]].getLatLng();
            //const bus2Loc = markers[line[1]].getLatLng();
            let item1 = markers[line[0]]
            let item2 = markers[line[1]]
            if (item1.name === 'Bus' && item2.name === 'Bus') {
                components.push(new Line(indices[1],line[0], line[1], 'NAYY 4x50 SE', 5));
                indices[1] += 1;
            } else if (item1.name === 'Bus' ^ item2.name === 'Bus'){
                if (item1.name === 'Bus') {
                    [item1,item2] = [item2, item1];
                }
                const busIndex = busIdMap.get(item2.id);
                switch(item1.name) {
                    case 'Load':
                        components.push(new Load(indices[2], busIndex, 5, 5));
                        indices[2] += 1;
                        break;
                    case 'Solar Panel':
                    case 'Wind Turbine':
                        components.push(new Generator(indices[3], busIndex, 5));
                        indices[3] += 1;
                        break;
                    case 'External Grid':
                        components.push(new ExtGrid(indices[6], busIndex, 5, 20));
                        indices[6] += 1;
                        break;
                    case 'Transformer':
                        components.push(new Transformer(indices[4], busIndex, 5, 20));
                        indices[4] +=1;
                        break;
                    default:
                        break;
                }
            }
        }
        
        const total = buses.concat(components);
        return  JSON.stringify(new Network(total));

    }

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
            const droppedLatLng1 = mapContainer.current.containerPointToLatLng([x-22.5, y]);
            const droppedLatLng2 = mapContainer.current.containerPointToLatLng([x+22.5, y]);

            // Get the icon for the dragged item based on its type
            const icon = iconMapping[draggedItem.type];
            if (icon.options.id === 'trafo1' ) {
                console.log(icon)
                const newMarker1 = { id: markers.length, position: droppedLatLng1, name: draggedItem.name, icon };
                const newMarker2 = { id: markers.length+1, position: droppedLatLng2, name: draggedItem.name, icon: iconMapping['trafo2'] };
                setMarkers([...markers,newMarker1, newMarker2]);
                    }
            else{
            // Add the dropped item as a marker on the map
            const newMarker = { id: markers.length, position: droppedLatLng, name: draggedItem.name, icon };
            setMarkers([...markers, newMarker]);}
        }
        setDraggedItem(null);};

    const handleMarkerClick = (markerIndex) => {
        // If no marker is currently selected, set the clicked marker as selected
        if (selectedMarker === null) {
            setSelectedMarker(markerIndex);
        } else {
            // If another marker is already selected
            if (selectedMarker !== markerIndex) {
                // Check if both markers still exist
                if (markers[selectedMarker] && markers[markerIndex]) {
                    // Logic for creating lines between markers
                    if (lines.length === 0 || lines[lines.length - 1].length === 2) {
                        const newLine = [markers[selectedMarker].position, markers[markerIndex].position];
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
                        }
                    } else {
                        const newLine = [markers[selectedMarker].position, markers[markerIndex].position];
                        setLines([...lines.slice(0, lines.length - 1), newLine]);
                    }
                }
            }
            // Unselect the marker regardless of the action taken
            setSelectedMarker(null);
        }
    };

    const handleMarkerDrag = (markerIndex, newPosition) => {
        let updatedLines;
        const markerOldPos = markers[markerIndex].position;
        const updatedMarkers=[...markers]
        if(markers[markerIndex].icon.options.id === 'trafo1' ) {
            updatedMarkers[markerIndex].position = newPosition;
            const markerOldPos2 = updatedMarkers[markerIndex+1].position;
            const {x, y} = mapContainer.current.latLngToContainerPoint(newPosition);
            updatedMarkers[markerIndex+1].position = mapContainer.current.containerPointToLatLng([x+45,y] );
            const newPosition2 = updatedMarkers[markerIndex+1].position;
            updatedLines = lines.map((line, index) => {
            if (line) {
                const [start, end] = line;
                if (start.equals(markerOldPos)) {
                    return [newPosition, end];
                } else if (end.equals(markerOldPos)) {
                    return [start, newPosition];
                }
            }
            return line;
        });

                        updatedLines = updatedLines.map((line, index) => {
            if (line) {
                const [start, end] = line;
                if (start.equals(markerOldPos2)) {
                    return [newPosition2, end];
                } else if (end.equals(markerOldPos2)) {
                    return [start, newPosition2];
                }
            }

            return line;
        });

        }
        else
            if(markers[markerIndex].icon.options.id === 'trafo2' ) {
            updatedMarkers[markerIndex].position = newPosition;
            const markerOldPos2 = updatedMarkers[markerIndex-1].position;
            const {x, y} = mapContainer.current.latLngToContainerPoint(newPosition);
            updatedMarkers[markerIndex-1].position = mapContainer.current.containerPointToLatLng([x-45,y] );
            const newPosition2 = updatedMarkers[markerIndex-1].position;
            updatedLines = lines.map((line, index) => {
            if (line) {
                const [start, end] = line;
                if (start.equals(markerOldPos)) {
                    return [newPosition, end];
                } else if (end.equals(markerOldPos)) {
                    return [start, newPosition];
                }
            }
            return line;
            });
            updatedLines = updatedLines.map((line, index) => {
            if (line) {
                const [start, end] = line;
                if (start.equals(markerOldPos2)) {
                    return [newPosition2, end];
                } else if (end.equals(markerOldPos2)) {
                    return [start, newPosition2];
                }
            }

            return line;
        });

        }
        else{
        updatedMarkers[markerIndex].position = newPosition;



         updatedLines = lines.map((line, index) => {
            if (line) {
                const [start, end] = line;
                if (start.equals(markerOldPos)) {
                    return [newPosition, end];
                } else if (end.equals(markerOldPos)) {
                    return [start, newPosition];
                }
            }
            return line;
        });}
        setMarkers(updatedMarkers);
        setLines(updatedLines);
    };

    const handleMarkerDelete = (indexMarker) => {

        const oldMarkerPos = markers[indexMarker].position;
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
        if (selectedMarker === indexMarker) {
            setSelectedMarker(null);
        }
        const updatedLines = lines.filter((line) => {
            // Check if the line contains the deleted marker's position
            return !line.some((position) => {
                return position.equals(oldMarkerPos);
            });
        });
        setLines(updatedLines);
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
        console.log(handleExport())
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

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            {/* Sidebar */}
            <div style={{
                flex: '0 0 10%',
                backgroundColor: '#f0f0f0',
                padding: '20px',
                overflowY: 'auto',
                margin: '10px'
            }}>
                <h2 style={{
                    fontSize: '19px',
                    fontFamily: 'Arial, sans-serif',
                    overflow: 'auto'
                }}>
                    Drag and drop items onto the canvas
                </h2>
                {/* Render draggable items */}
                {sidebarItems.map((item) => (
                    <div
                        key={item.id}
                        draggable={true}
                        onDragStart={(event) => handleDragStart(event, item)}
                        onDragEnd={handleDragEnd}
                        style={{margin: '10px 0', cursor: 'grab'}}
                    >
                        {/* Container for icon and text */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Render the icon based on item.type */}
                            <img src={iconMapping[item.type].options.iconUrl} alt={item.name} />
                            {/* Render the text */}
                            <div>{item.name}</div>
                        </div>
                    </div>
                ))}
                <Address />
            </div>
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
                        ref={mapContainer}
                        center={mapCenter}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{width: '100%', height: '100%', zIndex: 0, opacity: 1}}
                        zoomControl={false}
                        attributionControl={false}
                    >
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
                                    eventHandlers={{
                                        click: () => handleMarkerClick(index),
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
                                        <div style={{marginBottom: '5px'}}>
                                            <Parameter01 style={{alignSelf: 'center'}}/>
                                        </div>
                                        <div style={{marginBottom: '5px'}}>
                                            <Parameter02 style={{alignSelf: 'center'}}/>
                                        </div>
                                        <div style={{marginBottom: '5px'}}>
                                            <Parameter03 style={{alignSelf: 'center'}}/>
                                        </div>
                                        <div style={{marginBottom: '5px'}}>
                                            <SubmitButton style={{alignSelf: 'center'}}/>
                                        </div>
                                        <div style={{marginBottom: '5px'}}>
                                            <DeleteButton onClick={() => handleMarkerDelete(index)} />
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {lines.map((line, index) => (
                            // TODO: color can be changed to indicate overload, for example: color={'red'}
                            <Polyline key={index}
                                      positions={line}
                                      clickable={true}
                                      onMouseOver={e => e.target.openPopup()}
                                      onMouseOut={e => e.target.closePopup()}
                                      weight={10}
                            >
                                <Popup>A popup on click</Popup>
                            </Polyline>
                        ))}
                        <ZoomControl position="topright"/>
                    </MapContainer>
                    <IconButton aria-label="check" style={{
                        position: 'absolute',
                        right: '0px',
                        top: '600px',
                        width: '120px',
                        height: '120px',
                        opacity: '70'
                    }} onClick={onLockButtonClick}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <PlayArrowTwoToneIcon className="PlayArrowTwoToneIcon" style={{
                                width: '120px',
                                height: '120px',
                                color: '#05a95c',
                                borderWidth: '1px',
                                borderColor: '#000',
                                opacity: '70'
                            }}/>
                        </div>

                    </IconButton>
                </div>
            </div>
        </div>
);
}

export default ReactApp;