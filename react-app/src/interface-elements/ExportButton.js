//import { IconButton } from '@mui/material';
import { useMap } from 'react-leaflet';
import exportIcon from '../images/export.png';
import { Tooltip, Button } from 'antd';
import CanvasState from '../utils/CanvasState';

function ExportButton({markerRefs, lineRefs, markers, lines, mapContainer}) {
    const map = useMap();

    const saveToSystem = (stringData) => {
        //download to users file system
        //reference https://stackoverflow.com/questions/66078335/how-do-i-save-a-file-on-my-desktop-using-reactjs
        const blob = new Blob([stringData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'gridlybear_canvas_export.json'; // Specify the desired filename
        document.body.appendChild(link);
        link.click();

        // Clean up after download
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }

    const exp = () => {
        //Get map zoom and center
        let center = map.getCenter();
        let zoom = map.getZoom();

        //Save current canvas state to memory
        const exportData = new CanvasState(markers, null, lines, center, zoom, new Date());

        //Export data to file system as string
        const stringData = JSON.stringify(exportData);
        saveToSystem(stringData);
    }

    const ExportIcon = () => (
        <img
            src={exportIcon}
            alt="Export Icon"
            draggable="false"
            style={{
            width: 20,
            height: 20,
            }}
        />
    );

    return(
        <Tooltip title="Export">
            <Button className={'hasShadow'}
                    size={'large'}
                    onClick={() => {exp(markers, lines, mapContainer)}}
                    type="default" shape="square"
                    style={{width: 40, boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)'}}
                    icon={<ExportIcon/>}>
            </Button>
        </Tooltip>
    );

}

export default ExportButton;