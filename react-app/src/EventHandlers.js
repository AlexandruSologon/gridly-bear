import {useRef, useState} from "react";
import {message} from "antd";
import {findMarkerById, resetLinesRender, resetMarkerRender} from "./utils/api";
import debounce from "lodash.debounce";
import {
    defVal,
    iconMapping,
    lineDefaultColor,
    connectionDefaultColor,
    markerParametersConfig,
} from './utils/constants';

const mapContainer = useRef(null);
const [markers, setMarkers] = useState([]);
const markerRefs = useRef([]);
const lineRefs = useRef([]);
const [lines, setLines] = useState([]);
const [selectedMarker, setSelectedMarker] = useState(null);
const [isMapLocked, setIsMapLocked] = useState(true);
const [runClicked, setRunClicked] = useState(false);
const [draggedItem, setDraggedItem] = useState(null);
const [defaultValues, setDefaultValues] =  useState(defVal);
const [messageApi, contextHolder] = message.useMessage();
const [mapOpacity, setMapOpacity] = useState(1);
const [isHistoryOn, setIsHistoryOn] = useState(false);
const [history, setHistory] = useState([]);
const [highlightedMarker, setHighlightedMarker] = useState(null);

export const useEventHandlers = () => {
    function handleDragStart(event, item) {
        setDraggedItem(item);
    }

    function handleDragEnd(){
        let flag = false;
        for (const key in defaultValues[draggedItem.type]){
            if( defaultValues[draggedItem.type][key] === null) {
                flag = true;
            }
        }
        if(flag) {markerRefs.current[markers.length-1].openPopup() }
        setDraggedItem(null);
    }

    function handleDragOver(event){
        event.preventDefault();
    }

    function handleDrop (event)  {
        event.preventDefault();
        if (draggedItem) {
            const { clientX, clientY } = event;
            const { left, top } = event.currentTarget.getBoundingClientRect();
            const x = clientX - left;
            const y = clientY - top;
            const droppedLatLng = mapContainer.current.containerPointToLatLng([x, y]);
            const icon = iconMapping[draggedItem.type];
            const parametersConfig = markerParametersConfig[draggedItem.type];
            const parameters = parametersConfig ? parametersConfig.reduce((acc, param) => {
                acc[param.name] = '';
                return acc;
            }, {}) : {};

            for (const key in parameters)
                parameters[key] = defaultValues[draggedItem.type][key]

            let markerId = 0;
            if (markers.length !== 0) {
                markerId = markers[markers.length - 1].id + 1;
            }
            // Add the dropped item as a marker on the map
            const newMarker = {id: markerId,
                position: droppedLatLng,
                name: draggedItem.name,
                icon,
                type: draggedItem.type,
                parameters,
            };

            if (newMarker.name === "Transformer") {
                newMarker.connections = 0;
                newMarker.high = null;
                newMarker.low = null;
                newMarker.transformerType = defaultValues.trafo1.type
            }
            setMarkers([...markers, newMarker]);

        }
    }

    function handleMarkerClick(event, markerId) {
        const targetMarker = event.target;
        if (targetMarker) {
            targetMarker.closePopup();
        }

        //resetting style of prev marker if a new marker is clicked
        if (highlightedMarker !== null && markerRefs.current[highlightedMarker]) {
            markerRefs.current[highlightedMarker]._icon.style.filter = '';
        }

        //setting current marker
        setHighlightedMarker(markerId);

        //giving correct style to selected marker
        if (markerRefs.current[markerId]) {
            markerRefs.current[markerId]._icon.style.filter = 'brightness(1.5)';
        }

        if (selectedMarker === null) {
            setSelectedMarker(markerId);
        } else {
            let selected = findMarkerById(selectedMarker, markers);
            let current = findMarkerById(markerId, markers);
            if (selectedMarker !== markerId && (selected.type === "bus" || current.type === "bus")) {
                if (selected && current) {
                    // Logic for creating lines between markers
                    let color = connectionDefaultColor;
                    let connection = "direct";
                    let type = null;
                    if (selected.type === "bus" && current.type === "bus") {
                        color = lineDefaultColor
                        connection = "electrical"
                        type = defaultValues.line.type
                    }
                    let newLine = {
                        position1: selected.position,
                        position2: current.position,
                        type: type,
                        color: color,
                        // ID of start marker and end marker sorted
                        busLine: [selected.id, current.id].sort(),
                        arrow: 'none',
                        connection: connection
                    };
                    console.log(newLine);
                    const sameLines = lines.filter(line =>
                        (line.busLine[0] === newLine.busLine[0] && line.busLine[1] === newLine.busLine[1]));

                    const found = sameLines.length !== 0;
                    let maxTransformer = false;
                    // Check for transformer constraints
                    if (selected.name === "Transformer") {
                        if (selected.connections >= 2) {
                            maxTransformer = true;
                        } else {
                            if (selected.high === null) {
                                selected.high = markerId;
                                newLine.arrow = 'high';
                            } else if (selected.low === null) {
                                selected.low = markerId;
                                newLine.arrow = 'low';
                            }
                            selected.connections++;
                        }
                    } else if (current.name === "Transformer") {
                        if (current.connections >= 2) {
                            maxTransformer = true;
                        } else {
                            if (current.high === null) {
                                current.high = selectedMarker
                                newLine.arrow = 'high';
                            } else if (current.low === null) {
                                current.low = selectedMarker
                                newLine.arrow = 'low';
                            }
                            current.connections++;
                        }
                    }

                    // Add line if it doesn't exist and doesn't break transformer constraints
                    if (!found && !maxTransformer){
                        setLines([...lines, newLine]);

                    }
                } else {
                    const newLine = [[selected.position, current.position],  '#000'];
                    setLines([...lines.slice(0, lines.length - 1), newLine]);
                }
            }
            setSelectedMarker(null);
            setHighlightedMarker(null);
            //resetting style of prev marker if a new marker is clicked
            if (highlightedMarker !== null && markerRefs.current[highlightedMarker]) {
                markerRefs.current[highlightedMarker]._icon.style.filter = '';
            }
        }
    }

    const handleMarkerDrag = debounce((markerId, newPosition) => {
        const oldPosition = findMarkerById(markerId, markers).position;
        const updatedMarkers = markers.map(marker => {
            if (marker.id === markerId) {
                return { ...marker, position: newPosition };
            }
            return marker;
        });

        const updatedLines = lines.map(line => {
            const lineRef = lineRefs.current[lines.indexOf(line)];
            if (lineRef) lineRef.closePopup();

            if (line.position1.lat === oldPosition.lat && line.position1.lng === oldPosition.lng) {
                return {...line, position1: newPosition};
            } else if (line.position2.lat === oldPosition.lat && line.position2.lng === oldPosition.lng) {
                return {...line, position2: newPosition};
            } else {
                return line;
            }
        })

        setMarkers(updatedMarkers);
        resetMarkerRender(updatedMarkers, markerRefs)
        setLines(resetLinesRender(updatedLines, updatedMarkers));
    }, 100);

    function handleMarkerDelete(markerId) {
        const oldMarker = findMarkerById(markerId, markers);
        const oldMarkerPos = oldMarker.position;
        const oldMarkerId = oldMarker.id;
        const markerRef = markerRefs.current[markers.indexOf(oldMarker)];
        if (markerRef) {
            const style = markerRef.valueOf()._icon.style;
            if(markerRef.options.type !== 'bus') {
                style.border = ''
                style.borderWidth = ''
            }
            markerRef.closePopup();
        }

        const updatedMarkers = markers.map(marker => {
            if (marker.name === "Transformer") {
                const c = marker.connections;
                if (marker.low === oldMarkerId) {
                    return {...marker, low: null, connections: c-1};
                } else if (marker.high === oldMarkerId) {
                    return {...marker, high: null, connections: c-1};
                }
            }
            return marker;
        });
        updatedMarkers.splice(markers.indexOf(oldMarker), 1);
        setMarkers(updatedMarkers);

        if (selectedMarker === markerId) {
            setSelectedMarker(null);
        }
        const updatedLines = lines.filter(line =>
            !((line.position1.lat === oldMarkerPos.lat && line.position1.lng === oldMarkerPos.lng) ||
                (line.position2.lat === oldMarkerPos.lat && line.position2.lng === oldMarkerPos.lng)));
        setLines(resetLinesRender(updatedLines, updatedMarkers));
        resetMarkerRender(markers, markerRefs)

    }

    function handleMarkerHover(markerId, isHovered) {
        if (markerId && markerId._icon) {
            if (isHovered) {
                markerId._icon.style.filter = 'brightness(1.5)';
            } else {
                markerId._icon.style.filter = '';
            }
        }
    }

    function handleTransReverse(markerId){
        const marker = findMarkerById(markerId, markers);
        const [newHigh, newLow] = [marker.low, marker.high];
        const updatedMarkers = markers.map(marker => {
            if (marker.id === markerId) {
                return {
                    ...marker,
                    high: newHigh,
                    low: newLow
                };
            }
            return marker;
        });
        setMarkers(updatedMarkers);

        const updatedLines = lines.map(line => {
            if(line.position1 === marker.position || line.position2 === marker.position) {
                if (line.arrow === "high") return {...line, arrow: "low"};
                if (line.arrow === "low") return {...line, arrow: "high"};
            }
            return line;
        })

        setLines(updatedLines);
        resetMarkerRender(updatedMarkers, markerRefs);
        resetLinesRender(updatedLines, updatedMarkers);
    }

    function handleLineDelete(index) {
        const lineRef = lineRefs.current[index];
        const oldBusLine = lines[index].busLine;
        if (lineRef) {
            lineRef.closePopup();
        }
        const updatedLines = [...lines.slice(0, index), ...lines.slice(index + 1)];

        const marker1 = findMarkerById(oldBusLine[0], markers);
        const marker2 = findMarkerById(oldBusLine[1], markers);
        let oldMarkerId = null;
        if (marker1.name === "Transformer" || marker2.name === "Transformer") {
            if (marker1.name === 'Transformer') oldMarkerId = marker2.id;
            else oldMarkerId = marker1.id;

            const updatedMarkers = markers.map(marker => {
                if (marker.name === "Transformer") {
                    const c = marker.connections;
                    if (marker.low === oldMarkerId) {
                        return {...marker, low: null, connections: c-1};
                    } else if (marker.high === oldMarkerId) {
                        return {...marker, high: null, connections: c-1};
                    }
                }
                return marker;
            });

            setMarkers(updatedMarkers);
        }
        setLines(updatedLines);
        lineRefs.current.splice(index, 1);
    }

    function handleMarkerRightClick(event) {
        event.originalEvent.preventDefault();
        const targetMarker = event.target;
        if (targetMarker && targetMarker.getPopup()) {
            targetMarker.openPopup();
        }
    }

    function handleLineClick(event) {
        const targetLine = event.target;
        if (targetLine) {
            targetLine.closePopup();
        }
    }

    function handleLineRightClick(event) {
        event.originalEvent.preventDefault();
        const targetLine = event.target;
        if (targetLine && targetLine.getPopup()) {
            targetLine.openPopup();
        }
    }

    function handleParameterChange(markerId, paramName, value) {

        const updatedMarkers = markers.map(marker => {
            if (marker.id === markerId) {
                return {
                    ...marker,
                    parameters: {
                        ...marker.parameters,
                        [paramName]: value
                    }
                };
            }
            return marker;
        });
        setMarkers(updatedMarkers);
    }

    function replaceDefaultValues(marker){
        let newValue = defaultValues;
        for(const key in marker.parameters) {
            const paramName = key;
            const value = marker.parameters[key];
            if(value !== null && value !== 0 && value !== '')
            {
                newValue = {
                    ...newValue,
                    [marker.type]: {...newValue[marker.type], [paramName]: value}
                }
            }}
        setDefaultValues(newValue)
    }

    function onLockButtonClick() {
        setIsMapLocked(!isMapLocked);
        const map = mapContainer.current;
        if (isMapLocked) {
            map.dragging.disable();
            map.keyboard.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
        } else {
            map.dragging.enable();
            map.keyboard.enable();
            map.scrollWheelZoom.enable();
        }
        return isMapLocked;
    }

    return {
        mapContainer,
        markerRefs,
        lineRefs,
        markers,
        setMarkers,
        lines,
        setLines,
        selectedMarker,
        setSelectedMarker,
        isMapLocked,
        setIsMapLocked,
        runClicked,
        setRunClicked,
        draggedItem,
        setDraggedItem,
        defaultValues,
        setDefaultValues,
        mapOpacity,
        setMapOpacity,
        isHistoryOn,
        setIsHistoryOn,
        history,
        setHistory,
        highlightedMarker,
        setHighlightedMarker,
        messageApi,
        contextHolder,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
        handleMarkerClick,
        handleMarkerDrag,
        handleMarkerDelete,
        handleTransReverse,
        handleMarkerHover,
        handleParameterChange,
        replaceDefaultValues,
        onLockButtonClick,
        handleLineDelete,
        handleMarkerRightClick,
        handleLineClick,
        handleLineRightClick
    };
};