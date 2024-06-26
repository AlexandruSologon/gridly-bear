import { Drawer } from "@mui/material";
import { useState } from "react";
import { useMap } from "react-leaflet";

function HistoryDrawer(props) {

    return (
        <Drawer
            data-testid= "historyDrawer"
            open={props.isHistoryOn}
            onClose={() => props.setIsHistoryOn(!props.isHistoryOn)}
            PaperProps={{
                sx: {
                    backgroundColor: "rgba(253, 253, 253, 1)",
                    color: "#000",
                    width: '420px',
                    textAlign: 'center',
                    transition: 'height 0.3s, border 0.3s',
                    marginRight: '30px',
                    height: props.isHistoryOn ? '600px' : '0px' ,
                    marginTop: '80px',
                    borderRadius: '8px',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
                    zIndex: 1005,
                    overflow: 'hidden',
                    border: props.isHistoryOn ? 1 : 0,
                    borderColor: '#d9d9d9'
                }
            }}
            style={{
                display: 'grid',
                position: 'absolute',
                zIndex: 1002,
                right: '440px'
            }}
            variant="permanent"
            anchor="topright"
        >
        <div style={{height: '3%'}}></div>
            <h2 style={{
                    fontFamily: '-apple-system, system-ui', // Changed font family
                    margin: '10px 0', // Added margin for spacing
                    padding: '10px',
                    textAlign: 'left',
                    marginLeft: '10px'
                }}
            >
                History of succesful simulations
            </h2>
            <HistoryList history={props.history} setMarkers={props.setMarkers} setLines={props.setLines}></HistoryList>
        </Drawer>
    );
}

function HistoryList(p) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}
        >
            {
                p.history.map((h) => (
                    <SingleHistoryItem item={h} setMarkers={p.setMarkers} setLines={p.setLines} />
                ))
            }
        </div>
    );
}

function SingleHistoryItem(p) {

    const [hovered, setHovered] = useState(false);
    const map = useMap();

    return (
        <div 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setStates(p, map)}
            className="hasShadow"
            style={
                {
                    position: 'relative',
                    width: '95%',
                    height: '88px' ,
                    border: '1px solid lightgrey',
                    margin: '8px',
                    background: hovered ? '#F6F8FA' : 'white',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }
            }
        >
            {/* TODO: calculate relevant stats here from the available data,
                TODO: return canvas back to state it was in for this particular history element
            */}
            <p> <b>Time</b> : {p.item.getTime()} <br/>
            <b>Buses</b> : {p.item.getWarningBusCount()} warnings - {p.item.getOverloadBusCount()} Overloaded <br/>
            <b>Lines</b> : {p.item.getWarningLineCount()} warnings - {p.item.getOverloadLineCount()} Overloaded</p>
            <div
                className="colorstatebar"
                style={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '14px',
                    right: 0,
                    background: p.item.getRepresentativeColor(),
                }}

            ></div>
        </div>
    );
}

function setStates(p, map) {
    p.item.applyState(p.setMarkers, p.setLines, map);
}

export default HistoryDrawer;
