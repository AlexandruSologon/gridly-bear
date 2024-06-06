import React, { useState } from 'react';

function LineSettings() {
    const [selectedOption, setSelectedOption] = useState('');

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
            <select value={selectedOption} onChange={handleChange} style={{ maxHeight: '150px', overflowY: 'scroll' }}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
    );
}

export default LineSettings;

