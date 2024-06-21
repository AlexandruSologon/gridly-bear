import L from "leaflet";

const size = 60;
const anchor = 30;
export const iconMapping = {
    grid: new L.icon({
        id: 'grid',
        iconRetinaUrl: require('../images/grid.png'),
        iconUrl: require('../images/grid.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    solar: new L.icon({
        id: 'solar',
        iconRetinaUrl: require('../images/solarPanel.png'),
        iconUrl: require('../images/solarPanel.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    bus: new L.icon({
        id: 'bus',
        iconUrl: require('../images/bus.png'),
        iconRetinaUrl: require('../images/bus.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [48, 48],
        className: 'dot'

    }),
    load: new L.icon({
        id: 'load',
        iconRetinaUrl: require('../images/load.png'),
        iconUrl: require('../images/load.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    wind: new L.icon({
        id: 'wind',
        iconRetinaUrl: require('../images/windTurbine.png'),
        iconUrl: require('../images/windTurbine.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    trafo1: new L.icon({
        id: 'trafo1',
        iconRetinaUrl: require('../images/transformer.png'),
        iconUrl: require('../images/transformer.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    battery: new L.icon({
        id: 'battery',
        iconRetinaUrl: require('../images/battery.png'),
        iconUrl: require('../images/battery.png'),
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    })
};
