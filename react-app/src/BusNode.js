import './index.css';
import { Handle} from 'reactflow';
import React from "react";
const CustomNode = ({isConnectable}) => {
  return (
      <>
      <Handle
          type="source"
        isConnectableEnd="true"
        isConnectableStart="true"
        className="hand"
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />

          <div className="dotIcon"></div>
      </>
  );
};

export default CustomNode;