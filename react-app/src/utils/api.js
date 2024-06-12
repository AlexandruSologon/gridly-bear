import {cnvs_json_post} from './api_interaction';
import {Bus, ExtGrid, Generator, Line, Load, Network, Transformer} from '../CoreClasses';
import {binarySearch, busDefaultColor, lineDefaultColor} from './constants';
import CanvasState from './CanvasState';

export const handleExport = (markerInputs, markers, lines) => {
    const buses = [];
    const components = [];
    let indices = [0, 0, 0, 0, 0, 0, 0];
    const busIdMap = new Map();
    const transLines = [];
    markerInputs.forEach((marker) => {
        if(marker.name === "Bus")
        {
            const busIndex = indices[0];
            indices[0] += 1;
            let newBus;
            if (busIndex === 0) newBus = new Bus(busIndex, marker.position, parseFloat(marker.parameters.voltage));
            else newBus = new Bus(busIndex, marker.position, parseFloat(marker.parameters.voltage));
            buses.push(newBus);
            busIdMap.set(marker.id, busIndex);
        }
    })
    for (let i = 0; i < lines.length; i++) {
        const lineObject = lines[i]
        const line = lineObject.busLine;
        let item1 = binarySearch(markers, line[0], 0, markers.length - 1);
        let item2 = binarySearch(markers, line[1], 0, markers.length - 1);
        if (item1.name === 'Bus' && item2.name === 'Bus') {
            components.push(new Line(indices[1],
                                busIdMap.get(line[0]),
                                busIdMap.get(line[1]),
                                item1.position.distanceTo(item2.position)/1000,
                                lineObject.type));
            indices[1] += 1;
        } else if (item1.name === 'Bus' ^ item2.name === 'Bus'){
            if (item1.name === 'Bus') {
                [item1,item2] = [item2, item1];
            }
            const busIndex = busIdMap.get(item2.id);
            switch(item1.name) {
                case 'Load':
                    components.push(new Load(indices[2], busIndex, parseFloat(item1.parameters.p_mv), parseFloat(item1.parameters.q_mvar)));
                    indices[2] += 1;
                    break;
                case 'Solar Panel':
                case 'Wind Turbine':
                    components.push(new Generator(indices[3], busIndex, parseFloat(item1.parameters.power)));
                    indices[3] += 1;
                    break;
                case 'External Grid':
                    components.push(new ExtGrid(indices[6], busIndex, parseFloat(item1.parameters.voltage)));
                    indices[6] += 1;
                    break;
                case 'Transformer':
                    let newTransLine = [item1.high, item1.low];
                    let found = false;
                    for (let i = 0; i < transLines.length; i++) {
                        const item = transLines[i];
                        if (item[0] === newTransLine[0] && item[1] === newTransLine[1]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        transLines.push(newTransLine);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    for (let i = 0; i < transLines.length; i++) {
        const line = transLines[i];
        components.push(new Transformer(indices[4], busIdMap.get(line[0]), busIdMap.get(line[1]), '0.25 MVA 20/0.4 kV'));
        indices[4] +=1;
    }

    const total = buses.concat(components);
    const networkData = JSON.stringify(new Network(total));
    console.log('Exported Data:', networkData);
    return networkData;
};


export const onRunButtonClick = (markers, runClicked, setRunClicked, setIsMapLocked, lines, setLines, setMarkers, markerRefs, messageApi, history, setHistory, map) => {
    if(runClicked) return;
    setRunClicked(true);
    setIsMapLocked(true);

    const key = 'awaitsimalert';
    messageApi
        .open({
            key,
            type: 'loading',
            content: 'Awaiting Simulation Results..',
            duration: 0,
        });

    const markerInputs = markers.map(marker => ({
        id: marker.id,
        type: marker.type,
        parameters: marker.parameters,
        name: marker.name
    }));

    const dat = handleExport(markerInputs, markers, lines);
    console.log('Sent over Data:', dat);
    cnvs_json_post(dat)
        .then((data) => {
            renderLines(data, lines, markers, setLines);
            renderBuses(data, markers, markerRefs);
            messageApi.open({
                key,
                type: 'success',
                content: 'simulation complete!',
                duration: 2,
            });
            let zoom = map.getZoom();
            let center = map.getCenter();
            setHistory([new CanvasState(markers, markerRefs, lines, center, zoom, new Date(), data), ...history]);
        }).catch((error) => {
            console.log(error.message + " : " +  error.details);
            messageApi.open({
                key,
                type: 'error',
                content: error.message,
                duration: 2,
            });
        }).finally(() => {
            setRunClicked(false);
        });
};

const renderLines = (data, lines, markers, setLines) => {
    let nr = -1;
    const uL = lines.map((line) => {
            if (findMarkerById(line.busLine[0], markers).name === findMarkerById(line.busLine[1], markers).name) {
                nr++;
                const [hue, saturation, lightness] = data.lines[nr];
                line.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            }
            return line;
        }
    );
    setLines(uL) ;
};

const renderBuses = (data, markers, markerRefs) => {
    let nr = 0;
    markerRefs.current.forEach(marker => {
        if(marker !== null) {
        const  style = marker.valueOf()._icon.style;
        if (marker.options.icon.options.id === "bus"){
            const [hue, saturation, lightness] = data.buses[nr];
            style.border = `hsl(${hue}, ${saturation}%, ${lightness}%) solid 6px`;
            style.borderRadius = '50%'
            nr++;
        } else {
            style.border = ''
            style.borderRadius = ''
        }
    }})
}


export const resetMarkerRender = (markers, markerRefs) => {
    if(typeof markerRefs.current !== 'undefined')
    for( let i =0; i< markerRefs.current.length; i++) {
        const marker = markerRefs.current[i];
        if(marker !== null)
        if(markers[i] !== null && typeof markers[i] !== 'undefined') {
            const style = marker.valueOf()._icon.style;
            if (markers[i].type === 'bus') {
                style.border = busDefaultColor + ' solid 6px'
                style.borderRadius = '50%'
            } else {
                style.border = 'none'
                style.borderRadius = ''
            }
        }
    }}

export const resetLinesRender = (lines, markers) => {
    return lines.map((line) => {
                if ((findMarkerById(line.busLine[0], markers).type === 'bus')
                    && (findMarkerById(line.busLine[1], markers).type === 'bus')) {
                    line.color = lineDefaultColor;
                }
                return line
            }
        );
    }

export const findMarkerById = (id,markers) => {
    return binarySearch(markers, id, 0, markers.length - 1);
}