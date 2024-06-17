import React, { useState } from 'react';
import Select from 'react-select';

function BatterySettings({ battery }) {
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        'Load',
        'Generator'
    ];

    const handleChange = (option) => {
        setSelectedOption(option);
        battery.state = option.value;
    };

    
    return (
        <div style={{ marginBottom: '5px' }}>
            <div style={{marginBottom: '5px'}}>{"Select Battery state:"}</div>
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

export default BatterySettings;

