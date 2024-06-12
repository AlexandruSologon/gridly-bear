import { LatLng } from "leaflet";
import { resetLinesRender, resetMarkerRender } from "./api";
import { iconMapping } from "./constants";

export default class CanvasState {

    static ids = 0;

    constructor(markers, markerRefs, lines, center, zoom, time, simRes) {
        //Todo make copies instead of using the same references
        this.markers = markers.map((marker) => {
            let newmarker = Object.assign({}, marker);
            newmarker.icon = marker.type;
            return newmarker;
        });
        this.markerRefs = markerRefs;
        this.simRes = simRes;
        this.lines = lines;
        this.center = center;
        this.zoom = zoom;
        this.time = time;
    }

    applyState(setMarkers, setLines, map) {

        //Reset the icons of the markers
        this.markers.map((marker) => {
            marker.icon = iconMapping[marker.type];
            marker.position = new LatLng(marker.position.lat, marker.position.lng);
            return marker;
        });

        //Reset line longitude and latitude
        this.lines.map((line) => {
            line.position1 = new LatLng(line.position1.lat, line.position1.lng);
            line.position2 = new LatLng(line.position2.lat, line.position2.lng);
            return line;
        });

        setMarkers(this.markers);
        setLines(resetLinesRender(this.lines, this.markers));
        map.setView(this.center, this.zoom);
        resetMarkerRender(this.markers, this.markerRefs);
    }

    //TODO
    getRepresentativeColor() {
        //Get the worst (most red) color value of all buses or lines and return it
        // Initialize a variable to store the worst color value
        let worstHue = 255;

        // Iterate through all buses or lines
        for (const bus of Object.values(this.simRes.buses)) {
            if (bus[0] < worstHue) {
                worstHue = bus[0];
            }
        }

        for (const line of Object.values(this.simRes.lines)) {
            if (line[0] < worstHue) {
                worstHue = line[0];
            }
        }

        // Return the worst color value
        return "hsl(" + worstHue + ", 100%, 50%)";
    }

    //TODO
    getWarningBusCount() {
        let c = 0;

        // Iterate through all buses or lines
        for (const bus of Object.values(this.simRes.buses)) {
            if (bus[0] > 0 && bus[0] < 120) {
                c += 1;
            }
        }

        return c;
    }

    //TODO
    getWarningLineCount() {
        let c = 0;

        // Iterate through all buses or lines
        for (const line of Object.values(this.simRes.lines)) {
            if (line[0] > 0 && line[0] < 120) {
                c += 1;
            }
        }

        return c;
    }

    //TODO
    getOverloadBusCount() {
        let c = 0;

        // Iterate through all buses or lines
        for (const bus of Object.values(this.simRes.buses)) {
            if (bus[0] <= 0) {
                c += 1;
            }
        }

        return c;
    }

    //TODO
    getOverloadLineCount() {
        let c = 0;

        // Iterate through all buses or lines
        for (const line of Object.values(this.simRes.lines)) {
            if (line[0] <= 0) {
                c += 1;
            }
        }

        return c;
    }

    getTime() {
        return JSON.stringify(this.time.getMonth()) + "/"
            + JSON.stringify(this.time.getDay()) + " - "
            + JSON.stringify(this.time.getHours()) + ":"
            + JSON.stringify(this.time.getMinutes());
    }

}
