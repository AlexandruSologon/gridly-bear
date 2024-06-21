import { Button, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import InfoPanel from "./InfoPanel";
import { useState } from "react";

function InfoButton(props) {

    const [infoActive, setInfoActive] = useState(true);

    return(
        <div>
            <Tooltip title="Help">
                <Button 
                    className={'hasShadow'}
                    style={{width: 40}}
                    size={'large'}
                    onClick={() => setInfoActive(true)}
                    type="default" 
                    shape="square" 
                    icon={<QuestionCircleOutlined />}
                >
                </Button>
            </Tooltip>
            <InfoPanel active={infoActive} setInfoActive={setInfoActive}/>
        </div>
    );
}

export default InfoButton;
