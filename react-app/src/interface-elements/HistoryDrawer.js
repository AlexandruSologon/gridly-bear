import { Drawer } from "@mui/material";

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
                    width: '624px',
                    textAlign: 'center',
                    transition: 'height 0.3s',
                    marginRight: '30px',
                    height: props.isHistoryOn ? '600px' : '0px' ,
                    marginTop: '80px',
                    borderRadius: '8px',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
                    zIndex: 1005
                }
            }}
            style={{
                display: 'grid',
                position: 'absolute',
                zIndex: 1002,
                right: '644px'
            }}
            variant="permanent"
            anchor="topright"
        >
            <div style={{height: '3%'}}></div>
            <h2 style={{
                    fontSize: props.isHistoryOn ? '18px' : '0px' ,
                    transition: 'font-size 0.2s' , // Increased font size
                    fontFamily: 'Helvetica, sans-serif', // Changed font family
                    margin: '10px 0', // Added margin for spacing
                    padding: '10px',
                    textAlign: 'left',
                    marginLeft: '10px'
                }}
            >
                History of succesful simulations
            </h2>
            <HistoryList history={props.history}></HistoryList>
        </Drawer>
    );
}

function HistoryList(p) {
    return <div>
        {
            p.history.map((h) => (
                <SingleHistoryItem item={h}/>
            ))
        };
    </div>
}

function SingleHistoryItem(p) {
    return (
        <div style={
            {
                width: '90%',
                borderColor: 'black',
                border: '2px',
                background: 'grey'
            }
        }>
            {/* TODO: calculate relevant stats here from the available data,
                TODO: return canvas back to state it was in for this particular history element
            */}
            <p> Markers on element: {p.item.markers.length} </p>
        </div>
    );
}

export default HistoryDrawer;
