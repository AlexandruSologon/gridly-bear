import './index.css';
import { Handle} from 'reactflow';
import React from "react";
const CustomNode = ({isConnectable}) => {
  return (
      <>
      <Handle
        type="target"
        className="hand"
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />

          <div className="dotIcon"></div>
      </>
  );
};

export default CustomNode;