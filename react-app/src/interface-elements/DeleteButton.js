import React from 'react';

const DeleteButton = ({ onClick }) => (
    <div style={{marginBottom: '5px'}}>
        <button style={{color: 'red'}} onClick={onClick}>
            Delete
        </button>
    </div>
);

export default DeleteButton;