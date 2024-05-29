import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/LockOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import React from "react";

function LockButton(props) {
    const [isMapLocked, setIsMapLocked] = React.useState(true);

    const onLockButtonClick = () => {
        setIsMapLocked(!isMapLocked);
        props.onLockButtonClick();
    }

    return(
        <IconButton aria-label="check" style={{
                        position: 'absolute',
                        right: '6px',
                        top: '80px',
                        width: '40px',
                        height: '40px',
                        opacity: '30'
                    }} onClick={onLockButtonClick}>
                        <div style={{position: 'relative'}}>
                            <LockIcon className="LockIcon" style={{
                                width: '40px',
                                height: '40px',
                                color: '#000',
                                borderWidth: '1px',
                                borderColor: '#000',
                                opacity: '30',
                                display: !isMapLocked ? 'flex' : 'none'
                            }}/>
                            <LockOpenIcon className="LockOpenIcon" style={{
                                width: '40px',
                                height: '40px',
                                color: '#000',
                                borderWidth: '1px',
                                borderColor: '#000',
                                opacity: '30',
                                display: isMapLocked ? 'flex' : 'none'
                            }}/>
                        </div>
                    </IconButton>)
}

export default LockButton;