
import WindTurbine from "./images/windmill.png";
import './index.css';
import { Handle} from 'reactflow';
const CustomNode = ({isConnectable}) => {
  return (
      <>
      <Handle
        type="source"
        className="hand"
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
          <img className="icon" src={WindTurbine} alt={"Solar Panel"}/>
      </div>
          </>
  );
};

export default CustomNode;
