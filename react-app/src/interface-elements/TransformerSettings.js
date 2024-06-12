import React, { useState } from 'react';
import Select from 'react-select';

function TransformerSettings({ marker }) {
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        '160 MVA 380/110 kV',
        '100 MVA 220/110 kV',
        '63 MVA 110/20 kV',
        '40 MVA 110/20 kV',
        '25 MVA 110/20 kV',
        '63 MVA 110/10 kV',
        '40 MVA 110/10 kV',
        '25 MVA 110/10 kV',
        '0.25 MVA 20/0.4 kV',
        '0.4 MVA 20/0.4 kV',
        '0.63 MVA 20/0.4 kV',
        '0.25 MVA 10/0.4 kV',
        '0.4 MVA 10/0.4 kV',
        '0.63 MVA 10/0.4 kV',
        '63/25/38 MVA 110/20/10 kV',
        '63/25/38 MVA 110/10/10 kV'
    ];

    const handleChange = (option) => {
        setSelectedOption(option);
        marker.transformerType = option.value
    };

    return (
        <div style={{ marginBottom: '5px' }}>
            <div style={{marginBottom: '5px'}}>{"Select Transformer type:"}</div>
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

export default TransformerSettings;

