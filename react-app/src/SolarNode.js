
import SolarPanel from "./images/solar-panel.png";
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
const CustomNode = ({isConnectable}) => {
  return (
      <>
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
          <img className="icon" src={SolarPanel} alt={"Solar Panel"}/>
      </div>
          </>
  );
};

export default CustomNode;


/*
export default memo(({data, isConnectable}) => {
    return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
          <img className="icon" src={SolarPanel} alt={"Solar Panel"} />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 10, top: 'auto', background: '#fff' }}
        isConnectable={isConnectable}
      />
    </>
  );
});*/
