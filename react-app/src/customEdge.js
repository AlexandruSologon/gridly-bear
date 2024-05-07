import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    arrowHeadType,
    markerEndId,
  }) => {
    // Create a straight line path
    const edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  
    return (
      <>
        <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
        {/* <text>
          <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
            {data.text}
          </textPath>
        </text> */}
      </>
    );
  };  

export default CustomEdge;