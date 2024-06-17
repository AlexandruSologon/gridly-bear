import {defVal} from "../utils/constants";
import {Button, Tooltip} from "antd";
import {HistoryOutlined, ReloadOutlined} from "@ant-design/icons";



function ResetCanvasButton({setLines, setMarkers, setDraggedItem, setSelectedMarker, setDefaultValues }) {
const refreshCanvas = () => {
        setLines([])
        setMarkers([])
        setDraggedItem(null)
        setSelectedMarker(null)
        setDefaultValues(defVal)
    }

return (
    <div>
            <Tooltip title="refresh">
                    <Button className={'hasShadow'} style={{width: 40}} size={'large'}
                            onClick={() => refreshCanvas()} type="default" shape="square"
                            icon={<ReloadOutlined />}>
                    </Button>
            </Tooltip>
    </div>

);
}

export default ResetCanvasButton;