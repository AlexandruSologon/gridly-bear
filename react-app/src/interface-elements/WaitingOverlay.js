import React from 'react';

function WaitingOverlay({runClicked, color='rgba(255, 255, 255, 0.15)'}) {

    const renderWaitingOverlay = () => {
        return (
            <div style = {
                { 
                    position: 'fixed',
                    overflow: 'hidden',
                    top: 0, 
                    left: 0, 
                    width: '100vw', 
                    height: '100vh', 
                    backgroundColor: color, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    zIndex: 1070 
                }
            }>
            </div>
        );
    };

    return (
        <div>
            { runClicked && renderWaitingOverlay() }
        </div>
    );
}

export default WaitingOverlay;
