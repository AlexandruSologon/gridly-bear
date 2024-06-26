import L from "leaflet";
import Grid from '../images/grid.svg';
import Solar from '../images/solarPanel.svg';
import Bus from '../images/bus.svg';
import Load from '../images/load.svg';
import WindTurbine from '../images/windTurbine.svg';
import Transformer from '../images/transformer.svg';
import Battery from '../images/battery.svg';

const size = 100;
const anchor = 30;
export const iconMapping = {
    grid: new L.divIcon({
        html: <div>{Grid}</div>,
        iconSize: [size, size]
    }),
    solar: new L.icon({
        id: 'solar',
        iconRetinaUrl: Solar,
        iconUrl: Solar,
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    bus: new L.icon({
        id: 'bus',
        iconUrl: Bus,
        iconRetinaUrl: Bus,
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [48, 48],
        className: 'dot'
    }),
    load: new L.icon({
        id: 'load',
        iconRetinaUrl: Load,
        iconUrl: Load,
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    wind: new L.icon({
        id: 'wind',
        iconRetinaUrl: WindTurbine,
        iconUrl: WindTurbine,
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    trafo1: new L.icon({
        id: 'trafo1',
        iconRetinaUrl: Transformer,
        iconUrl: Transformer,
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    }),
    battery: new L.icon({
        id: 'battery',
        iconRetinaUrl: Battery,
        iconUrl: Battery,
        iconAnchor: [anchor, anchor],
        popupAnchor:[0, -anchor],
        iconSize: [size, size]
    })
};
