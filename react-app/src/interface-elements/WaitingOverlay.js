import React from 'react';

function WaitingOverlay({runClicked}) {

    const renderWaitingOverlay = () => {
        return (
            <div style = {
                { 
                    position: 'absolute',
                    overflow: 'hidden',
                    top: 0, 
                    left: 0, 
                    width: '100vw', 
                    height: '100vh', 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    zIndex: 1000 
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
