import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import '../css-files/index.css';
import { Button, Space, Input, Tooltip, List } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function Search() {
    const map = useMap();
    const [searchField, setSearchField] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider,
            showMarker: false,
        });

        map.addControl(searchControl);

        return () => {
            map.removeControl(searchControl);
        };
    }, [map]);

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query });
        setSuggestions(results);
    };

    const handleSearch = async () => {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchField });
        if (results.length > 0) {
            const { x, y } = results[0];
            map.setView([y, x], 14);
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchField(value);
        fetchSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchField(suggestion.label);
        map.setView([suggestion.y, suggestion.x], 14);
        setSuggestions([]);
    };

    return (
        <Space direction="vertical" style={{ width: '300px', borderRadius: '10px', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)', }}>
            <Input.Group compact>
                <Input
                    style={{ width: 260, height:40 }}
                    value={searchField}
                    onPressEnter={handleSearch}
                    placeholder="Search..."
                    onChange={handleInputChange}
                />
                <Tooltip title="Search">
                    <Button
                        onClick={handleSearch}
                        type="default"
                        icon={<SearchOutlined />}
                        size="large"
                    />
                </Tooltip>
            </Input.Group>
            {suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    zIndex: 1000,
                    width: '300px',
                    backgroundColor: 'white',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    marginTop: '2px'
                }}>
                    <List
                        bordered
                        dataSource={suggestions}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleSuggestionClick(item)}
                                style={{cursor: 'pointer'}}
                            >
                                {item.label}
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </Space>
    );
}

export default Search;