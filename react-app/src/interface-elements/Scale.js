import L from "leaflet";
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function Scale() {
    const map = useMap();

    useEffect(() => {
        const scale = L.control.scale({
            metric: true,
            imperial: false,
            maxWidth: 100,
            position: 'bottomright'
        });

        scale.addTo(map);

        return () => {
            map.removeControl(scale);
        };
    }, [map]);

    return null;

} 

export default Scale;