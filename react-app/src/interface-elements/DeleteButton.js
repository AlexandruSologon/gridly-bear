import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteButton = ({ onClick }) => (
    <div style={{ marginBottom: '5px', marginTop: '5px' }}>
        <Button
            onClick={onClick}
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            style={{
                border: '1px solid black',
                color: 'red',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            Remove
        </Button>
    </div>
);

export default DeleteButton;