import { Divider, Modal } from "antd";
import {Carousel, Image} from "antd";
import dragdroptutorial from '../images/dragdroptutorial.gif';
import makelinetutorial from '../images/makelinetutorial.gif';
import connectwithbuses from '../images/connectwithbuses.png';

export default function InfoPanel({ active, setInfoActive }) {
    return (
        <Modal 
            open={active}
            onOk={() => {setInfoActive(false)}}
            onCancel={() => {setInfoActive(false)}}
            centered
            width={'60vw'}
            footer={[]}
        >
            <div style={{height: '60vh'}}>
                <CarouselFilled></CarouselFilled>
            </div>
        </Modal>
    );
}

function CarouselFilled() {
    const contentStyle = {
        margin: '2%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Add this line to center vertically
        color: 'grey',
        lineHeight: '10px',
        textAlign: 'center',
    };

    return (
        <Carousel arrows infinite={false} style={{ width: '100%', height: '100%' }}>

            <div style={contentStyle}>
                <h3 style={{margin:'3%'}}>Drag and drop items</h3>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Image preview={false} width="70%" src={dragdroptutorial} />
                    <Divider type="vertical"></Divider>
                    <p>Hold and drag from the sidebar to put network components on the map</p>
                </div>
            </div>

            <div style={contentStyle}>
                <>
                <h3>Create lines between two components</h3>
                <Image preview={false} width="30%" src={makelinetutorial} />
                <Divider type="vertical"/>
                <p>hi</p>
                </>
            </div>

            <div style={contentStyle}>
                <>
                <h3>Connect items using the bus component</h3>
                <Image preview={false} width="40%" src={connectwithbuses} />
                <Divider type="vertical"/>
                <p>hi</p>
                </>
            </div>

        </Carousel>
    );
}
