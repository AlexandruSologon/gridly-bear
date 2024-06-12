import React from 'react';
import { Popup } from "react-leaflet";
import DeleteButton from "./DeleteButton";
import { markerParametersConfig } from "../utils/constants";
import { Button, Input} from "antd";
import { SwapOutlined } from "@ant-design/icons";
import {CheckBox} from "@mui/icons-material";

function ReverseButton({ onClick }) {
    return (
        <div style={{marginBottom: '5px', marginTop: '5px'}}>
            <Button
                icon={<SwapOutlined style={{ color: 'dodgerblue' }} />}
                style={{
                    border: '1px solid black',
                    color: 'dodgerblue',
                    display: 'flex',
                    alignItems: 'center'}}
                onClick={onClick}>
                Reverse
            </Button>
        </div>
    );
}

function MarkerButtons({marker, index, handleMarkerDelete, handleTransReverse, replaceDefaultValues}) {
    const { type } = marker;
    const isTransformer = (type === 'trafo1');
    const buttonsStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const deleteButton = <DeleteButton onClick={() => { handleMarkerDelete(marker.id); }}/>;
    const makeDefaultsButton = <Button onClick={() => replaceDefaultValues(marker)}></Button>

    return (
        <div style={buttonsStyle}>
            {isTransformer && <ReverseButton onClick={() => handleTransReverse(marker.id)} />}
            {makeDefaultsButton}
            {deleteButton}
        </div>
    );
}

function MarkerParameters({marker, handleParameterChange}) {
    const { id, type, parameters } = marker;
    const parameterFields = markerParametersConfig[type];
    if (!parameterFields) {
        console.log('Parameters configuration not found for marker type:', type);
        return null;
    }
    return parameterFields.map(param => (
        <div  key={param.name} style={{ marginBottom: '5px' }}>
            <ul>
                <li>

                {param.name.charAt(0).toUpperCase() + param.name.slice(1) + param.unit}:
            <Input
                type="text"
                //placeholder={param.charAt(0).toUpperCase() + param.slice(1)}
                value={parameters[param.name] || ''}
                onChange={(e) => handleParameterChange(id, param.name, e.target.value)}
                //size={'middle'}
                style={{width: '180px', marginLeft: '10px', marginRight: '10px', marginTop: '10px'}}
            /></li>
            </ul>
        </div>
    ));
}

export default function MarkerSettings({index, marker, handleParameterChange, handleMarkerDelete, handleTransReverse, replaceDefaultValues}) {
    return (
        <Popup>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '5px', fontSize: 17 }}>{marker.name}</div>
                <div>
                    <MarkerParameters
                        marker={marker}
                        handleParameterChange={handleParameterChange}
                    />
                    <MarkerButtons
                        marker={marker}
                        index={index}
                        replaceDefaultValues={replaceDefaultValues}
                        handleMarkerDelete={handleMarkerDelete}
                        handleTransReverse={handleTransReverse}
                    />
                </div>
            </div>
        </Popup>
    )
}