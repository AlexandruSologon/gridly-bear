import { Button, Tooltip } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

function HistoryButton(props) {

    return(
        <div>
            <Tooltip title="History">
                <Button 
                    className={'hasShadow'} 
                    style={{width: 40, boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)'}} 
                    size={'large'} 
                    onClick={() => props.setIsHistoryOn(!props.isHistoryOn)} 
                    type="default" 
                    shape="square" icon={<HistoryOutlined />}>
                </Button>
            </Tooltip>
        </div>
    );
}

export default HistoryButton;
