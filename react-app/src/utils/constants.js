import L from 'leaflet';
export const mapCenter = [51.91145215945188, 4.478236914116433];

export const resultIcon = function(line) {
    const div =  L.divIcon({className: 'resultMarker', html: line.value !== null ? line.value.toString() + "%" : ""});
    div.options.iconSize = [64,32]
    div.options.iconAnchor = [36,12]

    return div;
}


export const sidebarItems = [
    { id: 1, name: 'Wind Turbine', type: 'wind' },
    { id: 2, name: 'Solar Panel', type: 'solar' },
    { id: 3, name: 'Load', type: 'load' },
    { id: 4, name: 'Transformer', type: 'trafo1' },
    { id: 5, name: 'External Grid', type: 'grid' },
    { id: 6, name: 'Bus', type: 'bus' },
    { id: 7, name: 'Battery', type: 'battery'}
];


export const markerParametersConfig = {
    bus: [{name:'vn_kv', unit:'(kV)', mandatory: 'true'}],
    trafo1: [{name:'type', unit: '', mandatory: 'true'}],
    switch: [{name:'type', unit: '', mandatory: 'true'}],
    load: [{name:'p_mv',unit:'(kW)', mandatory:'true'}, {name:'q_mvar',unit:'(kVar)', mandatory: 'true'}],
    grid: [{name:'vm_pu', unit:'(p.u)', mandatory: 'true'}],
    solar: [{name:'p_mw', unit: '(MW)', mandatory:'true'}, {name:'vm_pu', unit:'(MVar)', mandatory:'false'}],
    wind: [{name:'p_mw', unit: '(MW)', mandatory:'true'}, {name:'vm_pu', unit:'(MVar)',mandatory:'false'}],
    battery: [{name:'p_mw', unit: '(MW)', mandatory:'true'}, {name: 'max_e_mwh', unit:'(MWh)', mandatory:'true'},
        {name: 'q_mvar', unit:'(MVar)', mandatory:'false'}, {name:'isGen', unit:'', mandatory:'true'}],
};

export const binarySearch = function(arr, x, start, end) {
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
 
    if (arr[mid].id === x) return arr[mid];
 
    if (arr[mid].id > x)
        return binarySearch(arr, x, start, mid - 1);
    else
        return binarySearch(arr, x, mid + 1, end);
}

export const defVal = {
    bus : {vn_kv: null},
    trafo1: {type: null},
    load: {p_mv: null, q_mvar: null},
    grid: {vm_pu: null},
    solar: {p_mw: null, vm_pu: null},
    wind: {p_mw: null, vm_pu: null},
    line: {type: null},
    battery: {p_mw: null, max_energy: null, q_mvar: null, isGen: false}
}
export const lineDefaultColor = '#706E6E'
export const connectionDefaultColor = '#1f3c6a'
export const busDefaultColor = '#636363'