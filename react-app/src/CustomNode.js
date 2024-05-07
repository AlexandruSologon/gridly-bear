import { Handle } from 'react-flow-renderer';

const CustomNode = ({ data }) => {
  return (
    <div style={{ padding: 10, background: '#D6D5E6', borderRadius: '5px' }}>
      {data.label}
    </div>
  );
};

export default CustomNode;
