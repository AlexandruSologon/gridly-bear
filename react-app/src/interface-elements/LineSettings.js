import React, { useState } from 'react';
import Select from 'react-select';
import { Popup } from "react-leaflet";
import DeleteButton from "./DeleteButton";
import {Button, Input} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {resetLinesRender, resetMarkerRender} from "../utils/api";

function Menu({ line, markers, lines, markerRefs, setLines }) {
    const [selectedOption, setSelectedOption] = useState({value: line.type, label: line.type});

    const options = [
        'NAYY 4x50 SE',
        'NAYY 4x120 SE',
        'NAYY 4x150 SE',
        'NA2XS2Y 1x95 RM/25 12/20 kV',
        'NA2XS2Y 1x185 RM/25 12/20 kV',
        'NA2XS2Y 1x240 RM/25 12/20 kV',
        'NA2XS2Y 1x95 RM/25 6/10 kV',
        'NA2XS2Y 1x185 RM/25 6/10 kV',
        'NA2XS2Y 1x240 RM/25 6/10 kV',
        'NA2XS2Y 1x150 RM/25 12/20 kV',
        'NA2XS2Y 1x120 RM/25 12/20 kV',
        'NA2XS2Y 1x70 RM/25 12/20 kV',
        'NA2XS2Y 1x150 RM/25 6/10 kV',
        'NA2XS2Y 1x120 RM/25 6/10 kV',
        'NA2XS2Y 1x70 RM/25 6/10 kV',
        'N2XS(FL)2Y 1x120 RM/35 64/110 kV',
        'N2XS(FL)2Y 1x185 RM/35 64/110 kV',
        'N2XS(FL)2Y 1x240 RM/35 64/110 kV',
        'N2XS(FL)2Y 1x300 RM/35 64/110 kV',
        '15-AL1/3-ST1A 0.4',
        '24-AL1/4-ST1A 0.4',
        '48-AL1/8-ST1A 0.4',
        '94-AL1/15-ST1A 0.4',
        '34-AL1/6-ST1A 10.0',
        '48-AL1/8-ST1A 10.0',
        '70-AL1/11-ST1A 10.0',
        '94-AL1/15-ST1A 10.0',
        '122-AL1/20-ST1A 10.0',
        '149-AL1/24-ST1A 10.0',
        '34-AL1/6-ST1A 20.0',
        '48-AL1/8-ST1A 20.0',
        '70-AL1/11-ST1A 20.0',
        '94-AL1/15-ST1A 20.0',
        '122-AL1/20-ST1A 20.0',
        '149-AL1/24-ST1A 20.0',
        '184-AL1/30-ST1A 20.0',
        '243-AL1/39-ST1A 20.0',
        '48-AL1/8-ST1A 110.0',
        '70-AL1/11-ST1A 110.0',
        '94-AL1/15-ST1A 110.0',
        '122-AL1/20-ST1A 110.0',
        '149-AL1/24-ST1A 110.0',
        '184-AL1/30-ST1A 110.0',
        '243-AL1/39-ST1A 110.0',
        '305-AL1/39-ST1A 110.0',
        '490-AL1/64-ST1A 110.0',
        '679-AL1/86-ST1A 110.0',
        '490-AL1/64-ST1A 220.0',
        '679-AL1/86-ST1A 220.0',
        '490-AL1/64-ST1A 380.0',
        '679-AL1/86-ST1A 380.0'
    ];

    const handleChange = (option) => {
        resetMarkerRender(markers,markerRefs)
        setLines(resetLinesRender(lines,markers));
        setSelectedOption(option);
        line.type = option.value;
    };

    return (
        <div>
            <div style={{marginBottom: '5px'}}>{"Select line type:"}</div>
            <Select
                value={selectedOption}
                onChange={handleChange}
                options={options.map(option => ({ value: option, label: option }))}
                isSearchable={true}
                menuPortalTarget={document.body}
                styles={{
                    control: styles => ({
                        ...styles,
                        width: '250px',
                        overflowY: 'scroll'
                    }),
                    menuPortal: base => ({ ...base, zIndex: 9999 }) // Ensure the dropdown is always on top
                }}
            />
        </div>
    );
}

const LineSettings = ({ line, index, handleLineDelete, replaceDefaultValues, changeLineLength, markers, markerRefs, lines, setLines }) => {
    const isElectricalLine = line.connection === "electrical";
    const makeDefaultButton = <Button onClick={() => replaceDefaultValues(line, true)} icon ={<SaveOutlined />} style={{border: '1px solid black'}}>Set as default</Button>

    return (
        <Popup>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '-apple-system, system-ui'}}>
                <div style={{marginBottom: '5px'}}>
                    {isElectricalLine ? "Electrical line" : "Direct Connection"}
                </div>
                {isElectricalLine && (
                    <div style={{marginBottom: '5px', zIndex: 1000}}>
                        <Menu line={line} lines={lines} markers={markers} markerRefs={markerRefs} setLines={setLines} />
                    </div>
                )}
                <div style={{marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {makeDefaultButton}
                    <DeleteButton onClick={() => handleLineDelete(index)}/> 
                </div>
                {isElectricalLine && (
                    <div style={{ marginBottom: '5px', alignItems: 'center' }}>
                        <div>
                        Length (km):
                        <Input
                            type = 'text'
                            value = {line.length}
                            onChange={(e) => changeLineLength(line,e.target.value)}
                            size={'middle'}
                            style={{width: '180px', marginLeft: '10px', marginRight: '10px', marginTop: '10px'}}>
                        </Input>
                        </div>
                    </div>
                )}
            </div>
        </Popup>
    );
};

export default LineSettings;

