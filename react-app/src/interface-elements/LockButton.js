import LockIcon from "@mui/icons-material/LockOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import React from "react";
import { Tooltip, Button } from "antd";

function LockButton(props) {
    const [isMapLocked, setIsMapLocked] = React.useState(true);

    const onLockButtonClick = () => {
        setIsMapLocked(!isMapLocked);
        props.onLockButtonClick();
    }

    return(
        <Tooltip title="Lock Map">
            <Button data-testid = "lockbutton"
                    className={'hasShadow'}
                    size={'large'}
                    onClick={onLockButtonClick}
                    type="default"
                    shape="square"
                    style={{width: 40, boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)'}}
                    icon={!isMapLocked ? <LockIcon data-testid = "lock-close-icon"/> : <LockOpenIcon data-testid = "lock-open-icon"/>}>
            </Button>
        </Tooltip>
    );
}

export default LockButton;