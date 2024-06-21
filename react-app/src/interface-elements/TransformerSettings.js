import React, { useState } from 'react';
import Select from 'react-select';

function TransformerSettings({ transformer }) {

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
    ].map(x => ({value:x, label:x}));



    const handleChange = (option) => {
        console.log(transformer.parameters.type);
        transformer.parameters.type = option.value;
    };

    return (
        <div style={{ marginBottom: '5px', zIndex: 1000 }}>
            <div style={{marginBottom: '5px'}}>{"Select Transformer type:"}</div>
            <Select
                value={options.find(x => x.value === transformer.parameters.type)}
                onChange={handleChange}
                options={options}
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

