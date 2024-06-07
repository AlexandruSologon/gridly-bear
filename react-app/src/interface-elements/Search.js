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
    const [searchField, setSearchField] = useState('');
    const provider = new OpenStreetMapProvider();

    useEffect(() => {
        const searchControl = new GeoSearchControl({
            style: 'button',
            provider,
            searchLabel: 'Enter address',
            showMarker: false,
        });

        //adding search functionality to map
        map.addControl(searchControl);

        const searchElement = document.querySelector('.searchbar');
        const searchButton = searchElement.querySelector('.searchbutton');

        return () => {
            map.removeControl(searchControl);
        };
    }, []);
        
    const handleSearch = async (query) => {
        const results = await provider.search({ searchField });
        setSearchResults(results);
    };

    //(<div><GeoSearchControl provider={provider}></GeoSearchControl></div>)
    return (
        <Space.Compact style={{ width: '300px' }}>
            <Input className={'searchbar'} placeholder="Search" onChange={(e) => setSearchField(e.target.value)}/>
            <Button className={'searchbutton'} onClick={handleSearch} type="default" icon={<SearchOutlined />} size='large'></Button>
        </Space.Compact>
    );
};

export default Search;
