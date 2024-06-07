import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import '../css-files/index.css';
import { Button, Space, Input, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Search() {
    
    //map hook
    const map = useMap();
    const [searchField, setSearchField] = useState('');

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            showMarker: false,
        });

        //adding search functionality to map
        map.addControl(searchControl);

        return () => {
            map.removeControl(searchControl);
        };
    }, []);
        
    const handleSearch = async (query) => {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchField });
        if (results.length > 0) {
            const { x, y } = results[0];
            map.setView([y, x], 14); // Set map view to the first result
        }
    };

    return (
        <Space.Compact style={{ width: '300px' }}>
            <Input activeShadow={'rgba(255,255,255,0)'} onPressEnter={handleSearch} placeholder="Search..." onChange={(e) => setSearchField(e.target.value)}/>
            <Tooltip title="search">
                <Button onClick={handleSearch} type="default" icon={<SearchOutlined />} size='large'></Button>
            </Tooltip>
        </Space.Compact>
    );
};

export default Search;
