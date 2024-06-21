import React from "react";
import { Button } from "antd";
import {CaretRightFilled} from '@ant-design/icons';

/**
 * Renders a run button with action.
 * @param {*} runClicked Boolean to convey the state of the canvas, "has this button been clicked and was there no response yet?".
 * @param {*} onRunButtonClick The action to be taken by the run button.
 * @returns 
 */
function RunButton(
    {
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
        map,
        onRunButtonClick
    }) {

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