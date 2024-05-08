import React from 'react';
import SolarPanel from './images/solar-panel.png'
import WindTurbine from './images/windmill.png'
import Load from './images/eco-house.png'

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
      <aside>
          <div className="description">You can drag these components to add them to the canvas.</div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'solar')} draggable>
              <img className="sideIcon" src={SolarPanel} alt={"Solar Panel"}/> Solar Panel
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'wind')} draggable>
              <img className="sideIcon" src={WindTurbine} alt={"Wind Turbine"}/> Wind Turbine
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'bus')} draggable>
              <span className="dot"></span> Bus
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'load')} draggable>
              <img className="sideIcon" src={Load} alt={"Load"}/> Load
          </div>
      </aside>
  );
};

export default Sidebar;