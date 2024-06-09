import React from 'react';
import {markerParametersConfig} from "../utils/constants";
import DeleteButton from "./DeleteButton";
import {Popup} from "react-leaflet";

function ReverseButton({ onClick }) {
    return (
        <div style={{marginBottom: '5px'}}>
            <button style={{color: 'blue'}} onClick={onClick}>
                Reverse
            </button>
        </div>
    );
}

function MarkerButtons({marker, index, handleMarkerDelete, handleTransReverse}) {
    const { type } = marker;
    const isTransformer = (type === 'trafo1');
    const buttonsStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
    const deleteButton = <DeleteButton onClick={() => { handleMarkerDelete(index); }}/>;

    return (
        <div style={buttonsStyle}>
            {deleteButton}
            {isTransformer && <ReverseButton onClick={() => handleTransReverse(marker.id)} />}
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
        <div key={param} style={{ marginBottom: '5px' }}>
            <input
                type="text"
                placeholder={param.charAt(0).toUpperCase() + param.slice(1)}
                value={parameters[param] || ''}
                onChange={(e) => handleParameterChange(id, param, e.target.value)}
            />
        </div>
    ));
}

export default function MarkerSettings({marker, index, handleParameterChange, handleMarkerDelete, handleTransReverse}) {
    return (
        <Popup>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '5px' }}>{marker.name}</div>
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