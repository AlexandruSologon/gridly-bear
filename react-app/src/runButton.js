import React from "react";
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';
import IconButton from '@mui/material/IconButton';
import Spinner from 'spin.js';
import CircularProgress from '@mui/material/CircularProgress';

function GreenArrow({onRunButtonClick}) {
    return (<IconButton aria-label="check" style={{
        position: 'absolute',
        right: '0px',
        top: '78%',
        width: '8vw',
        height: '8vw',
        opacity: '70'
    }} onClick={onRunButtonClick}>
        <PlayArrowTwoToneIcon className="PlayArrowTwoToneIcon" style={{
            width: '8vw',
            height: '8vw',
            color: '#05a95c',
            borderWidth: '1px',
            borderColor: '#000',
            opacity: '70'
    }}/>
    </IconButton>);
}

function AnularThrobber() {
    return (
        <div style={{ position: 'absolute', right: '0px', top: '78%', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress style={{ color: '#05a95c' }} />
        </div>
    );
}

function runButton({runClicked, onRunButtonClick}) {
    if(runClicked) {
        return AnularThrobber();
    } else {
        return GreenArrow({onRunButtonClick});
    }
}

export default runButton;
