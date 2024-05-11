import React, { useState, useRef } from 'react';
import './index.css';
import 'reactflow/dist/style.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet';

const CustomNodeFlow = () => {
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [lines, setLines] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const handleMarkerClick = (markerIndex) => {
        if (selectedMarker === null) {
            setSelectedMarker(markerIndex);
        } else {
            if (selectedMarker !== markerIndex) {
                if (lines.length === 0 || lines[lines.length - 1].length === 2) {
                    // If there are no lines or the last line is complete, start a new line
                    const newLine = [markers[selectedMarker].position, markers[markerIndex].position];
                    setLines([...lines, newLine]);
                } else {
                    // If a third marker is clicked, start a new line
                    const newLine = [markers[selectedMarker].position, markers[markerIndex].position];
                    setLines([...lines.slice(0, lines.length - 1), newLine]);
                }
            }
            setSelectedMarker(null);
        }
    };

    const handleMarkerDrag = (markerIndex, newPosition) => {
        const markerOldPos = markers[markerIndex].position;
        const updatedMarkers = [...markers];
        updatedMarkers[markerIndex].position = newPosition;
        setMarkers(updatedMarkers);

        const updatedLines = lines.map((line, index) => {
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

    // TODO: user's input address -> translated to latitude and longitude (hardcode for now)
    const mapCenter = [51.91145215945188, 4.478236914116433];

    // TODO: in case of needing to change the below icons for the sake of design,
    //  iconAnchor = [width/2, height/2] (width, height = dimension of image)
    const solarIcon = new L.icon({
        iconRetinaUrl: require('./images/solar.png'),
        iconUrl: require('./images/solar.png'),
        iconAnchor: [35, 35],
    });
    const busIcon = new L.icon({
        iconRetinaUrl: require('./images/bus.png'),
        iconUrl: require('./images/bus.png'),
        iconAnchor: [35, 35],
    });
    const loadIcon = new L.icon({
        iconRetinaUrl: require('./images/house.png'),
        iconUrl: require('./images/house.png'),
        iconAnchor: [32, 32],
    });
    const windIcon = new L.icon({
        iconRetinaUrl: require('./images/wind.png'),
        iconUrl: require('./images/wind.png'),
        iconAnchor: [42.5, 42.5],
    });

    const iconMapping = {
        solar: solarIcon,
        bus: busIcon,
        load: loadIcon,
        wind: windIcon
    };

    const sidebarItems = [
        { id: 1, name: 'Solar Panel', type: 'solar' },
        { id: 2, name: 'Bus', type: 'bus' },
        { id: 3, name: 'Load', type: 'load' },
        { id: 4, name: 'Wind Turbine', type: 'wind'}
    ];

    const [draggedItem, setDraggedItem] = useState(null);

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

            // Add the dropped item as a marker on the map
            const newMarker = { id: draggedItem.id, position: droppedLatLng, name: draggedItem.name, icon };
            setMarkers([...markers, newMarker]);
        }
        setDraggedItem(null);
    };

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
                        draggable
                        onDragStart={(event) => handleDragStart(event, item)}
                        onDragEnd={handleDragEnd}
                        style={{margin: '10px 0', cursor: 'grab'}}
                    >
                        {item.name}
                    </div>
                ))}
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
                        {markers.map((marker, index) => (
                            <Marker key={index}
                                    position={marker.position}
                                    icon={marker.icon}
                                    draggable={true}
                                    clickable={true}
                                    eventHandlers={{
                                        click: () => handleMarkerClick(index),
                                        mouseover: () => handleMarkerHover(index),
                                        mouseout: handleMarkerLeave,
                                        dragstart: () => setSelectedMarker(null),
                                        drag: (e) => handleMarkerDrag(index, e.target.getLatLng())
                                    }}
                            >
                                <Popup>{marker.name}</Popup>
                            </Marker>
                        ))}
                        {lines.map((line, index) => (
                            // TODO: color can be changed to indicate overload, for example: color={'red'}
                            <Polyline key={index} positions={line}/>
                        ))}
                        <ZoomControl position="topright"/>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default CustomNodeFlow;