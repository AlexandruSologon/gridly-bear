import L from 'leaflet';

export const mapCenter = [51.91145215945188, 4.478236914116433];

export const iconMapping = {
    grid: new L.icon({
        id: 'grid',
        iconRetinaUrl: require('../images/grid.png'),
        iconUrl: require('../images/grid.png'),
        iconAnchor: [32, 32],
        popupAnchor:[0, -32],
        iconSize: [80, 80]
    }),
    solar: new L.icon({
        id: 'solar',
        iconRetinaUrl: require('../images/solarPanel.png'),
        iconUrl: require('../images/solarPanel.png'),
        iconAnchor: [30, 25],
        popupAnchor:[0, -35],
        iconSize: [60, 50]
    }),
    bus: new L.icon({
        id: 'bus',
        iconUrl: require('../images/busIcon.png'),
        iconRetinaUrl: require('../images/busIcon.png'),
        iconAnchor: [24, 24],
        popupAnchor:[0, -32],
        iconSize: [48, 48],

    }),
    load: new L.icon({
        id: 'load',
        iconRetinaUrl: require('../images/load.png'),
        iconUrl: require('../images/load.png'),
        iconAnchor: [32, 28.5],
        popupAnchor: [0, -32],
        iconSize: [64, 57]
    }),
    wind: new L.icon({
        id: 'wind',
        iconRetinaUrl: require('../images/windTurbine.png'),
        iconUrl: require('../images/windTurbine.png'),
        iconAnchor: [35, 35],
        popupAnchor: [0, -35],
        iconSize: [70, 70]
    }),
    trafo1: new L.icon({
        id: 'trafo1',
        iconRetinaUrl: require('../images/energy.png'),
        iconUrl: require('../images/energy.png'),
        iconAnchor: [32, 32],
        popupAnchor: [0, -32],
        iconSize: [64, 64]
    })
};

export const sidebarItems = [
    { id: 1, name: 'Wind Turbine', type: 'wind' },
    { id: 2, name: 'Solar Panel', type: 'solar' },
    { id: 3, name: 'Load', type: 'load' },
    { id: 4, name: 'Transformer', type: 'trafo1' },
    { id: 5, name: 'External Grid', type: 'grid' },
    { id: 6, name: 'Bus', type: 'bus' }
];

export const markerParametersConfig = {
    bus: ['voltage'],
    transformer: ['type'],
    switch: ['type'],
    load: ['p_mv', 'q_mvar'],
    grid: ['voltage'],
    solar: ['power'],
    wind: ['power']
};