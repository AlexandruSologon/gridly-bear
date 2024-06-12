import { Button, Tooltip } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

function HistoryButton(props) {

    return(
        <div>
            <Tooltip title="history">
                <Button className={'hasShadow'} style={{width: 40}} size={'large'} onClick={() => props.setIsHistoryOn(!props.isHistoryOn)} type="default" shape="square" icon={<HistoryOutlined />}>
                </Button>
            </Tooltip>
        </div>
    );
}

export default HistoryButton;
