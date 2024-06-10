import React from "react";
import { Button } from "antd";
import {CaretRightFilled} from '@ant-design/icons';

/**
 * Renders both a run button.
 * @param {*} runClicked Boolean to convey the state of the canvas, "has this button been clicked and was there no response yet?".
 * @param {*} onRunButtonClick The action to be taken by the run button.
 * @returns 
 */
function RunButton({runClicked, onRunButtonClick}) {
    return (
        <Button data-testid="run-button" className={'hasShadow'} icon={<CaretRightFilled />} size={'large'} type="primary" onClick={onRunButtonClick} loading={runClicked}>
            Run
        </Button>
    );
}

export default RunButton;
