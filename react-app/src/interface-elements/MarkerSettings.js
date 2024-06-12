import React from 'react';
import { Popup } from "react-leaflet";
import DeleteButton from "./DeleteButton";
import { markerParametersConfig } from "../utils/constants";
import { Button, Input} from "antd";
import { SwapOutlined } from "@ant-design/icons";

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

function MarkerButtons({marker, index, handleMarkerDelete, handleTransReverse}) {
    const { type } = marker;
    const isTransformer = (type === 'trafo1');
    const buttonsStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const deleteButton = <DeleteButton onClick={() => { handleMarkerDelete(marker.id); }}/>;

    return (
        <div style={buttonsStyle}>
            {isTransformer && <ReverseButton onClick={() => handleTransReverse(marker.id)} />}
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
        <div  key={param} style={{ marginBottom: '5px' }}>
            <div style={{marginBottom: '5px', fontSize: 14, marginLeft: '10px'}}>
                {param.charAt(0).toUpperCase() + param.slice(1) + ":"}
            </div>
            <Input
                type="text"
                placeholder={param.charAt(0).toUpperCase() + param.slice(1)}
                value={parameters[param] || ''}
                onChange={(e) => handleParameterChange(id, param, e.target.value)}
                size={'middle'}
                style={{width: '180px', marginLeft: '10px', marginRight: '10px'}}
            />
        </div>
    ));
}

export default function MarkerSettings({index, marker, handleParameterChange, handleMarkerDelete, handleTransReverse}) {
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
                        handleMarkerDelete={handleMarkerDelete}
                        handleTransReverse={handleTransReverse}
                    />
                </div>
            </div>
        </Popup>
    )
}