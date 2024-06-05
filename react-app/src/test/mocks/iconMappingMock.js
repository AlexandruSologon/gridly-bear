import L from "leaflet";

const mockImage = jest.fn();

export const iconMappingMock = {
    grid: new L.icon({
        id: 'grid',
        iconRetinaUrl: mockImage,
        iconUrl: mockImage,
        iconAnchor: [32, 32],
        popupAnchor:[0, -32],
        iconSize: [80, 80]
    }),
    solar: new L.icon({
        id: 'solar',
        iconRetinaUrl: mockImage,
        iconUrl: mockImage,
        iconAnchor: [30, 25],
        popupAnchor:[0, -35],
        iconSize: [60, 50]
    }),
    bus: new L.icon({
        id: 'bus',
        iconUrl: mockImage,
        iconRetinaUrl: mockImage,
        iconAnchor: [24, 24],
        popupAnchor:[0, -32],
        iconSize: [48, 48],

    }),
    load: new L.icon({
        id: 'load',
        iconRetinaUrl: mockImage,
        iconUrl: mockImage,
        iconAnchor: [32, 28.5],
        popupAnchor: [0, -32],
        iconSize: [64, 57]
    }),
    wind: new L.icon({
        id: 'wind',
        iconRetinaUrl: mockImage,
        iconUrl: mockImage,
        iconAnchor: [35, 35],
        popupAnchor: [0, -35],
        iconSize: [70, 70]
    }),
    trafo1: new L.icon({
        id: 'trafo1',
        iconRetinaUrl: mockImage,
        iconUrl: mockImage,
        iconAnchor: [32, 32],
        popupAnchor: [0, -32],
        iconSize: [64, 64]
    })
};