import React, { useState } from 'react';
import Select from 'react-select';
import { Popup } from "react-leaflet";
import DeleteButton from "./DeleteButton";
import {connectionDefaultColor} from "../utils/constants";

function Menu({ line }) {
    const [selectedOption, setSelectedOption] = useState(null);

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

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        line.type = selectedOption;
    };

    return (
        <div>
            <div style={{marginBottom: '5px'}}>{"Select line type:"}</div>
            <Select
                value={selectedOption}
                onChange={handleChange}
                options={options.map(option => ({ value: option, label: option }))}
                isSearchable={true}
                styles={{
                    control: styles => ({
                        ...styles,
                        width: '250px',
                        overflowY: 'scroll'
                    })
                }}
            />
        </div>
    );
}

const LineSettings = ({ line, index, handleLineDelete }) => {
    const isElectricalLine = line.color !== connectionDefaultColor;

    return (
        <Popup>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '5px' }}>
                    {isElectricalLine ? "Electrical line" : "Direct Connection"}
                </div>
                <div style={{ marginBottom: '5px' }}>
                    <DeleteButton onClick={() => handleLineDelete(index)} />
                </div>
                {isElectricalLine && (
                    <div style={{ marginBottom: '5px' }}>
                        <Menu line={line} />
                    </div>
                )}
            </div>
        </Popup>
    );
};

export default LineSettings;

