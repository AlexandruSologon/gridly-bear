import L from "leaflet";
import { useMap } from 'react-leaflet';

function Scale() {
    const map = useMap();
    L.control.scale({
        metric: true,
        imperial: true,
        maxWidth: 100,
        position: 'bottomright'
    }).addTo(map);
} 

export default Scale;