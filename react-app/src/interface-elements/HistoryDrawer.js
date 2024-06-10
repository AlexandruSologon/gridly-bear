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
                History
            </h2>
        </Drawer>
    );
}

export default HistoryDrawer;
