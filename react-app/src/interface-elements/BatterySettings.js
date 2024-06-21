import React, { useState } from 'react';
import { markerParametersConfig } from "../utils/constants";
import {Radio, Input} from 'antd';

function BatterySettings({ battery, handleParameterChange }) {
    const [selectedOption, setSelectedOption] = useState(battery.isGen);

    const handleChange = (option) => {
        setSelectedOption(option.target.value);
        battery.isGen = option.target.value;
    };

    return (
        <div style={{ marginBottom: '5px' }}>
            <BatteryParams battery={battery} handleParameterChange={handleParameterChange}/>
            <div style={{marginBottom: '5px', textAlign: 'center'}}>{"Select Battery state:"}</div>
            <Radio.Group onChange={handleChange} value={selectedOption} style={{width: '100%', textAlign: "center"}}>
            <Radio value={false}>Load</Radio>
            <Radio value={true}>Generator</Radio>
            </Radio.Group>
        </div>
    );   
    
}

function BatteryParams({ battery, handleParameterChange }) {
    const parameterFields = markerParametersConfig['battery'];
    return parameterFields.filter(x => x.name !== 'isGen').map(param => (
        <div  key={param.name} style={{ marginBottom: '5px' }}>
            <ul>
                <li>

                {param.name.charAt(0).toUpperCase() + param.name.slice(1) +' '+ param.unit}:
            <Input
                type="text"
                value={battery.parameters[param.name] || ''}
                onChange={(e) => handleParameterChange(battery.id, param.name, e.target.value)}
                size={'middle'}
                style={{width: '180px', marginLeft: '10px', marginRight: '10px', marginTop: '10px'}}
            /></li>
            </ul>
        </div>
    ));
}

export default BatterySettings;

