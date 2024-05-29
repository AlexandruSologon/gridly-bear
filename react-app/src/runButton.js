import React from "react";
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Renders a green arrow run button.
 * @param {*} onRunButtonClick - The function to be called on the button's click.
 * @returns The jsx for the run button.
 */
function GreenArrow({onRunButtonClick}) {
    return (
        <IconButton aria-label="check" style = {
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
                color: '#05a95c',
                borderWidth: '1px',
                borderColor: '#000',
                opacity: '70'
            }
        }/>
    </IconButton>);
}

/**
 * Render a rotating waiting icon (aka an annular throbber).
 * @returns the jsx content for rendering the loading icon.
 */
function AnnularThrobber() {
    return (
        <div style = {
            { 
                position: 'absolute', 
                right: '0px', 
                top: '78%', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '8vh'
            }
        }>
            <CircularProgress style = {
                { 
                    color: '#05a95c', 
                    width: '8vw', 
                    height: '8vw' 
                }
            } 
            />
        </div>
    );
}

/**
 * Renders both a run button and a loading icon (annular throbber) depending on the state of the canvas.
 * @param {*} runClicked Boolean to convey the state of the canvas, "has this button been clicked and was there no response yet?".
 * @param {*} onRunButtonClick The action to be taken by the run button.
 * @returns 
 */
function runButton({runClicked, onRunButtonClick}) {
    if(runClicked) {
        return AnnularThrobber();
    } else {
        return GreenArrow({onRunButtonClick});
    }
}

export default runButton;
