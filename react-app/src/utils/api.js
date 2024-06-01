import { cnvs_json_post } from './api_interaction';
import {Bus, ExtGrid, Generator, Line, Load, Network} from '../CoreClasses';

export const handleExport = (markerInputs, markers, busLines) => {
    const buses = [];
    const components = [];
    let indices = [0, 0, 0, 0, 0, 0, 0];
    const busIdMap = new Map();

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
    for (let i = 0; i < busLines.length; i++) {
        const line = busLines[i];
        //const bus1Loc = markers[line[0]].getLatLng();
        //const bus2Loc = markers[line[1]].getLatLng();
        let item1 = markers[line[0]]
        let item2 = markers[line[1]]
        if (item1.name === 'Bus' && item2.name === 'Bus') {
            components.push(new Line(indices[1],busIdMap.get(line[0]), busIdMap.get(line[1]), item1.position.distanceTo(item2.position)/1000, 'NAYY 4x50 SE'));
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
                /*
                case 'Transformer':
                    components.push(new Transformer(indices[4], busIndex, 5, 20));
                    indices[4] +=1;
                    break;
                    */
                default:
                    break;
            }
        }
    }
    const total = buses.concat(components);
    const networkData = JSON.stringify(new Network(total));
    console.log('Exported Data:', networkData);
    return networkData;
};

export const onRunButtonClick = (markers, busLines, runClicked, setRunClicked, setIsMapLocked, setLines, setBusLines, setMarkers, markerRefs) => {
    if(runClicked) return;
    setRunClicked(true);
    setIsMapLocked(true);

    const markerInputs = markers.map(marker => ({
        id: marker.id,
        type: marker.type,
        parameters: marker.parameters,
        name: marker.name
    }));

    const dat = handleExport(markerInputs, markers, busLines);
    console.log('Sent over Data:', dat);
    cnvs_json_post(dat)
        .then((data) => {
            if(data === null) {
                return;
            } else {
                alert("Results: " + JSON.stringify(data));
                renderLines(data)
                renderBuses(data)
            }
        }).catch((error) => {
        console.log(error.message + " : " +  error.details);
        alert("Error showing results");
    }).finally(() => {
        setRunClicked(false);
    });
};

const renderLines = (data, lines, busLines, markers, setLines) => {
    let nr = -1;
    const uL = lines.map((line) =>  {
            if(markers[busLines[lines.indexOf(line)][0]].name === markers[busLines[lines.indexOf(line)][1]].name)
            {   nr++
                return [line[0],line[1],'hsl('+data.lines[nr][0]+','+data.lines[nr][1]+'%,'+data.lines[nr][2]+'%)']}
            else return line
        }
    );
    setLines(uL) ;
};

const renderBuses = (data, markers, markerRefs) => {
    let nr = 0;
    markerRefs.current.forEach(marker => {
        const  style = marker.valueOf()._getIcon.style;
        console.log(style.backgroundColor);
        if (marker.options.icon.options.id === "bus"){
            style.backgroundColor = '#fff'
            style.width = '48px'
            style.height = '48px'
            style.border = 'hsl('+data.buses[nr][0]+','+data.buses[nr][1]+'%,'+data.buses[nr][2]+'%)' + ' solid 6px'
            style.borderRadius = '50%'
            nr++;
        }
    })
};