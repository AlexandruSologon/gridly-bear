import { IconButton } from '@mui/material';

function ExportButton({markerRefs, lineRefs, markers, lines, busLines, mapContainer}) {
    
    const exp = () => {

        console.log(mapContainer);
        let center = 0; //mapContainer.getCenter(); todo
        let zoom = 0; //mapContainer.getZoom(); todo

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
        //https://stackoverflow.com/questions/66078335/how-do-i-save-a-file-on-my-desktop-using-reactjs
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

    return(
        <IconButton 
            aria-label="check"
            data-testid = "lockbutton"
            style={{
                margin: '5px',
                width: '40px',
                height: '40px',
                opacity: '30'
            }} onClick={() => {exp(markers, lines, busLines, mapContainer)}}>
            <div style={{position: 'relative'}}>
                <img src={require('../images/export.png')}
                    alt={"import"}
                    style={{
                        width: 50,
                        height: 50
                    }}
                />
            </div>
        </IconButton>
    );

}

export default ExportButton;