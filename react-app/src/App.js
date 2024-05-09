import React, { useState, useRef } from 'react';
import './index.css';
import 'reactflow/dist/style.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';

const CustomNodeFlow = () => {
    const mapContainer = useRef(null);
    const [markers, setMarkers] = useState([]);

    // TODO: user's input address -> translated to latitude and longitude (hardcode for now)
    const mapCenter = [51.91145215945188, 4.478236914116433];

    const solarIcon = new L.icon({
        iconRetinaUrl: require('./images/solar.png'),
        iconUrl: require('./images/solar.png')
    });

    const busIcon = new L.icon({
        iconRetinaUrl: require('./images/bus.png'),
        iconUrl: require('./images/bus.png')
    });

    const loadIcon = new L.icon({
        iconRetinaUrl: require('./images/house.png'),
        iconUrl: require('./images/house.png')
    });

    const windIcon = new L.icon({
        iconRetinaUrl: require('./images/wind.png'),
        iconUrl: require('./images/wind.png')
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
                <div style={{ position: 'relative', flex: '1', height: '100%' }}>
                    <MapContainer
                        ref={mapContainer}
                        center={mapCenter}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ width: '100%', height: '100%', zIndex: 0, opacity: 1 }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        {/* Opacity of TitleLayer can be changed to 0 when user want a blank canvas */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            opacity={0.7}
                        />
                        {markers.map(marker => (
                            <Marker key={marker.id} position={marker.position} icon={marker.icon}>
                                <Popup>{marker.name}</Popup>
                            </Marker>
                        ))}
                        <ZoomControl position="topright" />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default CustomNodeFlow;