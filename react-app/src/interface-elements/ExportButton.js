import { IconButton } from '@mui/material';
import { useMap } from 'react-leaflet';
import exportIcon from '../images/export.png';
import { Tooltip, Button } from 'antd';

function ExportButton({markerRefs, lineRefs, markers, lines, busLines, mapContainer}) {
    const map = useMap();
    const exp = () => {

        console.log(mapContainer);
        let center = map.getCenter();
        let zoom = map.getZoom();

        console.log("are there actual buslines? " + busLines);

        let newMarkers = markers.map((marker) => {
            let newmarker = Object.assign({}, marker);
            newmarker.icon = marker.type;
            return newmarker;
        });
        
        const exportData = {
            markers:newMarkers,
            lines,
            busLines,
            center,
            zoom
        }

        const stringData = JSON.stringify(exportData);

        console.log(exportData);

        //download to users file system
        //reference https://stackoverflow.com/questions/66078335/how-do-i-save-a-file-on-my-desktop-using-reactjs
        const blob = new Blob([stringData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'pandagui_canvas_export.json'; // Specify the desired filename
        document.body.appendChild(link);
        link.click();

        // Clean up after download
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
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
        <Tooltip title="export">
            <Button className={'hasShadow'} size={'large'} onClick={() => {exp(markers, lines, busLines, mapContainer)}} type="default" shape="square" icon={<ExportIcon/>}>
            </Button>
        </Tooltip>
    );

}

export default ExportButton;