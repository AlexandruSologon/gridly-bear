import { LatLng } from "leaflet";
import { resetLinesRender, resetMarkerRender } from "./api";
import { iconMapping } from "./constants";

export default class CanvasState {

    static ids = 0;

    constructor(markers, markerRefs, lines, busLines, center, zoom, time) {
        //Todo make copies instead of using the same references
        this.markers = markers.map((marker) => {
            let newmarker = Object.assign({}, marker);
            newmarker.icon = marker.type;
            return newmarker;
        });
        this.markerRefs = markerRefs;
        this.lines = lines;
        this.busLines = busLines;
        this.center = center;
        this.zoom = zoom;
        this.time = time;
    }

    applyState(setMarkers, setLines, setBusLines, map) {

        //Reset the icons of the markers
        this.markers.map((marker) => {
            marker.icon = iconMapping[marker.type];
            marker.position = new LatLng(marker.position.lat, marker.position.lng);
            return marker;
        });

        //Reset line longitude and latitude
        this.lines.map((line) => {
            line[0] = new LatLng(line[0].lat, line[0].lng);
            line[1] = new LatLng(line[1].lat, line[1].lng);
            return line;
        });

        setMarkers(this.markers);
        setLines(resetLinesRender(this.lines, this.markers));
        setBusLines(this.busLines);
        map.setView(this.center, this.zoom);
        resetMarkerRender(this.markers, this.markerRefs);
    }

    //TODO
    getRepresentativeColor() {
        return '#c3cbd9';
    }

    //TODO
    getProblemBusCount() {
        return this.markers.length;
    }

    //TODO
    getProblemLineCount() {
        return this.lines.length;
    }

    getTime() {
        return JSON.stringify(this.time.getMonth()) + "/"
            + JSON.stringify(this.time.getDay()) + " - "
            + JSON.stringify(this.time.getHours()) + ":"
            + JSON.stringify(this.time.getMinutes());
    }

}
