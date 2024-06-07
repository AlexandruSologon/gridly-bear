import React from "react";
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import IconButton from '@mui/material/IconButton';
import { Button } from "antd";
import {CaretRightFilled} from '@ant-design/icons';

/**
 * Renders a green arrow run button.
 * @param {*} onRunButtonClick - The function to be called on the button's click.
 * @returns The jsx for the run button.
 */
function GreenArrow({onRunButtonClick, runClicked}) {
    return (
        <IconButton
            data-testid = "run-button"
            aria-label="check" style = {
            {
                position: 'absolute',
                right: '0px',
                top: '78%',
                width: '8vw',
                height: '8vw',
                opacity: '70'
            }
        } onClick={onRunButtonClick}>
        <PlayArrowTwoToneIcon className="PlayArrowTwoToneIcon" style = {
            {
                width: '8vw',
                height: '8vw',
                color: runClicked ? 'rgba(5,169,92, 0.3)' : '#05a95c',
                borderWidth: '1px',
                borderColor: '#000',
                opacity: '70'
            }
        }/>
    </IconButton>);
}

/**
 * Renders both a run button and a loading icon (annular throbber) depending on the state of the canvas.
 * @param {*} runClicked Boolean to convey the state of the canvas, "has this button been clicked and was there no response yet?".
 * @param {*} onRunButtonClick The action to be taken by the run button.
 * @returns 
 */
function RunButton({runClicked, onRunButtonClick}) {
    return (
        <Button defaultBg={'#193156'} className={'hasShadow'} icon={<CaretRightFilled />} size={'large'} type="primary" onClick={onRunButtonClick} loading={runClicked}>
            Run
        </Button>
    );
}

export default RunButton;
