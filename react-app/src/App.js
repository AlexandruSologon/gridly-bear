import React, { useState, useRef, useCallback } from 'react';
import SolarPanel from './images/solar-panel.png';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import SolarNode from './SolarNode';
import BusNode from './BusNode';
import WindNode from "./WindNode";
import LoadNode from "./LoadNode";

import './index.css';

import CustomEdge from './customEdge';

const nodeTypes = {solar: SolarNode,
                        bus: BusNode,
                        wind: WindNode,
                        load: LoadNode};

const initialNodes = [
  {
    id: '1',
    type: 'solar',
    data: SolarPanel,
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const CustomNodeFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({...params, type:'custom'}, eds)),
    [],
  );

  const onElementClick = useCallback(
  (event, element) => {
    if (element.type === 'node') {
      setSelectedNodes((prevNodes) => {
        if (prevNodes.length === 2) {
          // Two nodes are already selected, create an edge between them
          setEdges((eds) => addEdge({ source: prevNodes[0].id, target: element.id, type: 'custom' }, eds));
          // Reset the selected nodes
          return [element];
        } else {
          // Less than two nodes are selected, add the clicked node to the selected nodes
          return [...prevNodes, element];
        }
      });
    }
  },
  [setEdges, setSelectedNodes],
);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div className="dndflow">
      <ReactFlowProvider>
          <Sidebar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
              connectionMode="loose"
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            edgeTypes={{ custom: CustomEdge }}
            onElementClick={onElementClick}
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default CustomNodeFlow;
