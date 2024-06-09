import React from "react";
import { Button } from "antd";
import {CaretRightFilled} from '@ant-design/icons';

/**
 * Renders both a run button and a loading icon (annular throbber) depending on the state of the canvas.
 * @param {*} runClicked Boolean to convey the state of the canvas, "has this button been clicked and was there no response yet?".
 * @param {*} onRunButtonClick The action to be taken by the run button.
 * @returns 
 */
function RunButton({runClicked, onRunButtonClick}) {
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
