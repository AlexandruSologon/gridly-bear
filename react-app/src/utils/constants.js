import L from 'leaflet';

const size = 60;
const anchor = 30;

export const mapCenter = [51.91145215945188, 4.478236914116433];

export const iconMapping = {
    grid: new L.icon({
        id: 'grid',
        iconRetinaUrl: require('../images/Group 16.png'),
        iconUrl: require('../images/Group 16.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    solar: new L.icon({
        id: 'solar',
        iconRetinaUrl: require('../images/Group 12.png'),
        iconUrl: require('../images/Group 12.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    bus: new L.icon({
        id: 'bus',
        iconUrl: require('../images/Group 15.png'),
        iconRetinaUrl: require('../images/Group 15.png'),
        iconAnchor: [24, 24],
        popupAnchor:[0, -32],
        iconSize: [48, 48],
        className: 'dot'

    }),
    load: new L.icon({
        id: 'load',
        iconRetinaUrl: require('../images/Group 13.png'),
        iconUrl: require('../images/Group 13.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    wind: new L.icon({
        id: 'wind',
        iconRetinaUrl: require('../images/Group 11.png'),
        iconUrl: require('../images/Group 11.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    trafo1: new L.icon({
        id: 'trafo1',
        iconRetinaUrl: require('../images/Group 14.png'),
        iconUrl: require('../images/Group 14.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    battery: new L.icon({
        id: 'battery',
        iconRetinaUrl: require('../images/Group 17.png'),
        iconUrl: require('../images/Group 17.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    })
};

export const sidebarItems = [
    { id: 1, name: 'Wind Turbine', type: 'wind' },
    { id: 2, name: 'Solar Panel', type: 'solar' },
    { id: 3, name: 'Load', type: 'load' },
    { id: 4, name: 'Transformer', type: 'trafo1' },
    { id: 5, name: 'External Grid', type: 'grid' },
    { id: 6, name: 'Bus', type: 'bus' },
    { id: 7, name: 'Battery', type: 'battery'}
];


export const markerParametersConfig = {
    bus: ['voltage'],
    trafo1: ['type'],
    switch: ['type'],
    load: ['p_mv', 'q_mvar'],
    grid: ['voltage'],
    solar: ['power'],
    wind: ['power'],
    //battery: ['net', 'p_mw']
};

export const binarySearch = function(arr, x, start, end) {
 
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
 
    if (arr[mid].id === x) return arr[mid];
 
    if (arr[mid].id > x)
        return binarySearch(arr, x, start, mid - 1);
    else
        return binarySearch(arr, x, mid + 1, end);
}

export const defVal = {
    bus : {voltage: 1},
    trafo1: {type: "0.4 MVA 10/0.4 kV"},
    load: {p_mv: 0.1, q_mvar: 0.05},
    grid: {voltage: 1.02},
    solar: {power: 1},
    wind: {power: 1},
}
export const lineDefaultColor = '#706E6E'
export const connectionDefaultColor = '#1f3c6a'
export const busDefaultColor = '#636363'