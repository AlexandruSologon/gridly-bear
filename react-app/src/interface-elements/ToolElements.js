import LockButton from "./LockButton";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";

function ToolElements({onLockButtonClick}) {
    return (
        <div style={
            {
                position: "absolute",
                top: '5px',
                right : '60px',
                display:'flex',
                justifyContent:'row'
            }
        }>
            <LockButton onLockButtonClick={onLockButtonClick} />
            <ImportButton></ImportButton>
            <ExportButton></ExportButton>
        </div>
    );
}

export default ToolElements;