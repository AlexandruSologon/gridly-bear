import React from 'react';
import { Popup } from "react-leaflet";
import DeleteButton from "./DeleteButton";
import { markerParametersConfig } from "../utils/constants";
import { Button, Input} from "antd";
import {SaveOutlined, SwapOutlined} from "@ant-design/icons";
import TransformerSettings from "./TransformerSettings";
import BatterySettings from "./BatterySettings";

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

function MarkerParameters({marker, handleParameterChange, handleTransReverse, handleMarkerDelete}) {
    const { id, type, parameters } = marker;
    // Check if marker is a Transformer
    if (type === 'trafo1'){
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TransformerSettings transformer={marker}/>
                <ReverseButton onClick={() => handleTransReverse(marker.id)}/>
            </div>
        )
    // Other markers
    } else if (type ==="battery"){
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BatterySettings battery={marker} handleParameterChange={handleParameterChange}/>
            </div>
        )

    } else {
        const parameterFields = markerParametersConfig[type];
        if (!parameterFields) {
            console.log('Parameters configuration not found for marker type:', type);
            return null;
        }
        return parameterFields.filter(x => x.name !== 'isGen').map(param => (
            <div  key={param.name} style={{ marginBottom: '5px' }}>
                <ul>
                    <li>

                    {param.name.charAt(0).toUpperCase() + param.name.slice(1) +' '+ param.unit}:
                <Input
                    type="text"
                    //placeholder={param.charAt(0).toUpperCase() + param.slice(1)}
                    value={parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(id, param.name, e.target.value)}
                    size={'middle'}
                    style={{width: '180px', marginLeft: '10px', marginRight: '10px', marginTop: '10px'}}
                /></li>
                </ul>
            </div>
        ));
    }
}

export default function MarkerSettings({index, marker, handleParameterChange, handleMarkerDelete, handleTransReverse, replaceDefaultValues}) {
    const makeDefaultButton = <Button onClick={() => replaceDefaultValues(marker)} icon ={<SaveOutlined />} style={{border: '1px solid black'}}>Set as default</Button>
    return (
        <Popup>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '-apple-system, system-ui' }}>
                <div style={{ marginBottom: '5px', fontSize: 17 }}>{marker.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MarkerParameters
                        marker={marker}
                        handleParameterChange={handleParameterChange}
                        handleTransReverse={handleTransReverse}
                        handleMarkerDelete={handleMarkerDelete}
                    />
                    {makeDefaultButton}
                    <DeleteButton onClick={() => {handleMarkerDelete(marker.id);}}/>
                </div>
            </div>
        </Popup>
    )
}