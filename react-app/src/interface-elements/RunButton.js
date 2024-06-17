import React from "react";
import { Button } from "antd";
import {CaretRightFilled} from '@ant-design/icons';
import { handleExport, renderBuses, renderLines } from "../utils/api";
import { cnvs_json_post } from "../utils/api_interaction";
import CanvasState from "../utils/CanvasState";

/**
 * Renders a run button with action.
 * @param {*} runClicked Boolean to convey the state of the canvas, "has this button been clicked and was there no response yet?".
 * @param {*} onRunButtonClick The action to be taken by the run button.
 * @returns 
 */
function RunButton({
        runClicked, 
        markers, 
        setRunClicked, 
        setIsMapLocked, 
        lines, 
        setLines, 
        setMarkers, 
        markerRefs, 
        messageApi, 
        history, 
        setHistory, 
        map}) {

    const onRunButtonClick = () => {
        if(runClicked) return;
        setRunClicked(true);
        setIsMapLocked(true);
    
        const key = 'awaitsimalert';
        messageApi
            .open({
                key,
                type: 'loading',
                content: 'Awaiting Simulation Results..',
                duration: 0,
            });
    
        const markerInputs = markers.map(marker => ({
            id: marker.id,
            type: marker.type,
            parameters: marker.parameters,
            name: marker.name,
            transformer: marker.transformerType
        }));
    
        const dat = handleExport(markerInputs, markers, lines);
        console.log('Sent over Data:', dat);
        cnvs_json_post(dat)
            .then((data) => {
                renderLines(data, lines, markers, setLines);
                renderBuses(data, markers, markerRefs);
                messageApi.open({
                    key,
                    type: 'success',
                    content: 'simulation complete!',
                    duration: 2,
                });
                let zoom = map.getZoom();
                let center = map.getCenter();
                setHistory([new CanvasState(markers, markerRefs, lines, center, zoom, new Date(), data), ...history]);
            }).catch((error) => {
                console.log(error.message + " : " +  error.details);
                messageApi.open({
                    key,
                    type: 'error',
                    content: error.message,
                    duration: 5,
                });
            }).finally(() => {
                setRunClicked(false);
            });
    };

    return (
        <Button data-testid="run-button"
                className={'hasShadow'}
                style={{boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)'}}
                icon={<CaretRightFilled />} size={'large'}
                type="primary"
                onClick={onRunButtonClick}
                loading={runClicked}>
            Run
        </Button>
    );
}

export default RunButton;