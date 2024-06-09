import {useEffect, useRef} from "react";
import {useMap} from "react-leaflet";
import L from "leaflet";
import { binarySearch } from "../utils/constants";

export default function PolylineDecorator({ lines, markers }) {
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
            let positions = [line[0], line[1]];
            const color = line[2];
            const arrow = line[3];
            let item0 = binarySearch(markers, line[4][0], 0, markers.length - 1)
            let item1 = binarySearch(markers, line[4][1], 0, markers.length - 1)
            if (item0.position.lat === line[1].lat && item0.position.lng === line[1].lng) {
                [item0, item1] = [item1, item0];
            }

            let opacity = 0;
            let offset = "80%";
            if (arrow !== "none") {
                opacity = 100;
                if (arrow === 'low') {
                    offset = "30%";
                    if (item1.name === "Transformer") positions = [line[1], line[0]];
                }
                if (arrow === 'high' && item0.name === "Transformer") positions = [line[1], line[0]];
            } 

            const polyline = L.polyline(positions, {
                color: color
            }).addTo(map);

            const decorator = L.polylineDecorator(polyline, {
                patterns: [
                    {
                        offset: offset,
                        repeat: 0,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 25,
                            polygon: false,
                            pathOptions: {
                                stroke: true,
                                weight: 5,
                                color: color,
                                clickable: true,
                                opacity: opacity
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
    }, [map, lines, markers]);

    return null;
}