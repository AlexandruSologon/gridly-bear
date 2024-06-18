export const mapCenter = [51.91145215945188, 4.478236914116433];

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
    bus: [{name:'voltage', unit:'(kV)'}],
    trafo1: [{name:'type', unit: ''}],
    switch: [{name:'type', unit: ''}],
    load: [{name:'p_mv',unit:'(kW)'}, {name:'q_mvar',unit:'(kVar)'}],
    grid: [{name:'voltage', unit:'(p.u)'}],
    solar: [{name:'p_mw', unit: '(MW)'}, {name:'vm_pu', unit:'(MVar)'}],
    wind: [{name:'p_mw', unit: '(MW)'}, {name:'vm_pu', unit:'(MVar)'}],
    //battery: ['net', 'p_mw']
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
    bus : {voltage: null},
    trafo1: {type: null},
    load: {p_mv: null, q_mvar: null},
    grid: {voltage: null},
    solar: {p_mw: null, vm_pu: null},
    wind: {p_mw: null, vm_pu: null},
    line: {type: null}
}
export const lineDefaultColor = '#706E6E'
export const connectionDefaultColor = '#1f3c6a'
export const busDefaultColor = '#636363'