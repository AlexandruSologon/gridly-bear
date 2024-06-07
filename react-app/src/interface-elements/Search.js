import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import '../css-files/index.css';
import { Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Search() {
    //map hook
    const map = useMap();
    const [searchField, setSearchField] = useState('');
        
    const handleSearch = async (query) => {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchField });
        if (results.length > 0) {
            const { x, y } = results[0];
            map.setView([y, x], 14); // Set map view to the first result
        }
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
