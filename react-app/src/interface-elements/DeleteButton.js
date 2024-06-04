import React from 'react';

const DeleteButton = ({ onClick }) => (
    <button style={{ color: 'red' }} onClick={onClick}>
        Delete
    </button>
);

export default DeleteButton;