import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import '../css-files/index.css';
import { Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Search() {
    //map hook
    const map = useMap();
    const [searchResults, setSearchResults] = useState([]);
    const provider = new OpenStreetMapProvider();

    // useEffect(() => {
    //     const searchControl = new GeoSearchControl({
    //         style: 'button',
    //         provider,
    //         searchLabel: 'Enter address',
    //         showMarker: false,
    //     });

    //     //adding search functionality to map
    //     map.addControl(searchControl);

    //     const searchElement = document.querySelector('.leaflet-control-geosearch');
    //     const searchButton = searchElement.querySelector('.glass');

    //     return () => {
    //         map.removeControl(searchControl);
    //     };
    // }, []);

        
    const handleSearch = async (query) => {
        const results = await provider.search({ query });
        setSearchResults(results);
        // Update map markers with search results (e.g., add markers to the map)
    };

    //(<div><GeoSearchControl provider={provider}></GeoSearchControl></div>)
    return (
        <Space.Compact style={{ width: '300px' }}>
            <Input defaultValue="Search" onClick={() => {handleSearch()}}/>
            <Button type="default" icon={<SearchOutlined />} size='large'></Button>
        </Space.Compact>
    );
};

export default Search;
