import {useEffect, useRef} from "react";
import {useMap} from "react-leaflet";
import L from "leaflet";

export function PolylineDecorator({ lines }) {
    const map = useMap();
    const polylineRefs = useRef([]);

    useEffect(() => {
        if (!map) return;

        polylineRefs.current.forEach(({ polyline, decorator }) => {
            map.removeLayer(polyline);
            map.removeLayer(decorator);
        });
        polylineRefs.current = [];

        lines.forEach(line => {
            const positions = [line[0], line[1]];
            const color = line[2];

            const polyline = L.polyline(positions, {
                color: color
            }).addTo(map);

            const decorator = L.polylineDecorator(polyline, {
                patterns: [
                    {
                        offset: "50%",
                        repeat: 0,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 50,
                            polygon: false,
                            pathOptions: {
                                stroke: true,
                                weight: 10,
                                color: color,
                                clickable: true
                            },
                        })
                    }
                ]
            }).addTo(map);

            polylineRefs.current.push({ polyline, decorator });
        });

        return () => {
            polylineRefs.current.forEach(({ polyline, decorator }) => {
                map.removeLayer(polyline);
                map.removeLayer(decorator);
            });
        };
    }, [map, lines]);

    return null;
}