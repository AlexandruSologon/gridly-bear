import { IconButton } from "@mui/material";

function ImportButton() {

    const imp = () => {

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
            }} onClick={imp}>
            <div style={{position: 'relative'}}>
                <img src={require('../images/import.png')}
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

export default ImportButton;