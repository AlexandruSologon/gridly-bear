import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import '../css-files/index.css';

function Search() {
    //map hook
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            style: 'button',
            provider,
            searchLabel: 'Enter address',
            showMarker: false,
        });

        //adding search functionality to map
        map.addControl(searchControl);

        const searchElement = document.querySelector('.leaflet-control-geosearch');
        const searchButton = searchElement.querySelector('.glass');

        // magnifying glass/search icon

        searchButton.innerHTML = fetch('ícon.svg');
        /*fetch('icon.svg')
            .then(response => response.text())
            .then(svgContent => {
                searchButton.innerHTML = svgContent;
            });*/

        return () => {
            map.removeControl(searchControl);
        };
    }, []);

    return null;
};

export default Search;