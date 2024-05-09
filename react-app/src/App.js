// import React, { useState, useRef, useCallback } from 'react';
// import {useMemo} from "react";
// import SolarPanel from './images/solar-panel.png';
// import {
//   StraightEdge,
// } from 'react-flow-renderer/nocss';
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   Controls,
// } from 'reactflow';
//
// import Sidebar from './Sidebar';
// import SolarNode from './SolarNode';
// import BusNode from './BusNode';
// import WindNode from "./WindNode";
// import LoadNode from "./LoadNode";
//
// import './index.css';
// import 'reactflow/dist/style.css';
// import 'leaflet/dist/leaflet.css';
// import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
//
// const initialNodes = [
//   {
//     id: '1',
//     type: 'solar',
//     data: SolarPanel,
//     position: { x: 250, y: 5 },
//   },
// ];
//
// let id = 0;
// const getId = () => `dndnode_${id++}`;
//
// const CustomNodeFlow = () => {
//   const reactFlowWrapper = useRef(null);
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [reactFlowInstance, setReactFlowInstance] = useState(null);
//   const [selectedNodes, setSelectedNodes] = useState([]);
//
//    const onConnect = useCallback(
//      (params) => setEdges((eds) => addEdge({...params}, eds)),
//      [setEdges],
//    );
//
//   const onElementClick = useCallback(
//   (event, element) => {
//     if (element.type === 'node') {
//       setSelectedNodes((prevNodes) => {
//         if (prevNodes.length === 2) {
//           // Two nodes are already selected, create an edge between them
//           setEdges((eds) => addEdge({ source: prevNodes[0].id, target: element.id }, eds));
//           // Reset the selected nodes
//           return [element];
//         } else {
//           // Less than two nodes are selected, add the clicked node to the selected nodes
//           return [...prevNodes, element];
//         }
//       });
//     }
//   },
//   [setEdges, setSelectedNodes],
// );
//
//
//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);
//
//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();
//
//       const type = event.dataTransfer.getData('application/reactflow');
//
//       // check if the dropped element is valid
//       if (typeof type === 'undefined' || !type) {
//         return;
//       }
//
//       // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
//       // and you don't need to subtract the reactFlowBounds.left/top anymore
//       // details: https://reactflow.dev/whats-new/2023-11-10
//       const position = reactFlowInstance.screenToFlowPosition({
//         x: event.clientX,
//         y: event.clientY,
//       });
//       const newNode = {
//         id: getId(),
//         type,
//         position,
//         data: { label: `${type} node` },
//       };
//
//       setNodes((nds) => nds.concat(newNode));
//     },
//     [reactFlowInstance, setNodes],
//   );
//
//   // TODO: user's input address -> translated to latitude and longitude (hardcode for now)
//   const mapCenter = [51.91145215945188, 4.478236914116433];
//
//   return (
//       <div style={{position: 'relative', width: '100%', height: '100%'}}>
//         <div className="dndflow" style={{position: 'absolute', width: '97%', height: '100%', zIndex:1}}>
//           <ReactFlowProvider>
//               <Sidebar />
//             <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{zIndex: 2}}>
//               <ReactFlow
//                   connectionMode="loose"
//                 nodes={nodes}
//                 nodeTypes={useMemo(
//         () => ({
//           solar: SolarNode,
//                             bus: BusNode,
//                             wind: WindNode,
//                             load: LoadNode
//         }),
//         [],
//             )}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 onConnect={onConnect}
//                 onInit={setReactFlowInstance}
//                 onDrop={onDrop}
//                 onDragOver={onDragOver}
//                  fitView
//                   edgeTypes={useMemo(
//          () => ({
//                 default: StraightEdge
//                 }),
//           [],
//                 )}
//                   connectionLineType = "straight"
//                 onElementClick={onElementClick}
//               >
//                 <Controls />
//               </ReactFlow>
//             </div>
//           </ReactFlowProvider>
//         </div>
//           {/* Opacity can be changed to 0 to have a blank canvas */}
//           <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{width: '100%', height: '100%', zIndex: 0, opacity: 1}}>
//               <TileLayer
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <ZoomControl position="topright" />
//           </MapContainer>
//       </div>
//   );
// };
//
// export default CustomNodeFlow;

import React from 'react';

import './index.css';
import 'reactflow/dist/style.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'


const CustomNodeFlow = () => {


  // TODO: user's input address -> translated to latitude and longitude (hardcode for now)
  const mapCenter = [51.91145215945188, 4.478236914116433];

  return (
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
          {/* Opacity can be changed to 0 to have a blank canvas */}
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{width: '100%', height: '100%', zIndex: 0, opacity: 1}}>
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="topright" />
          </MapContainer>
      </div>
  );
};

export default CustomNodeFlow;