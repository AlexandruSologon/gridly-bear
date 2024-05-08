import Load from "./images/eco-house.png";
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
          <img className="icon" src={Load} alt={"Electric Load"}/>
      </div>
          </>
  );
};

export default CustomNode;
