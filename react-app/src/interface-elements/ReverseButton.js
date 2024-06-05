import React from 'react';

const ReverseButton = ({ onClick }) => (
    <button style={{ color: 'blue' }} onClick={onClick}>
        Reverse
    </button>
);

export default ReverseButton;