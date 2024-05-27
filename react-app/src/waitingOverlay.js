import React, { useState } from 'react';

function WaitingOverlay({runClicked}) {

    const renderWaitingOverlay = () => {
        return (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <p>Waiting on results</p>
            </div>
        );
    };

    return (
        <div>
            {runClicked && renderWaitingOverlay()}
        </div>
    );
}

export default WaitingOverlay;
