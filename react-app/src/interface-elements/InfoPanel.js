import { Divider, Modal, Carousel, Image } from "antd";
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
    // const contentStyle = {
    //     margin: '2%',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center', // Add this line to center vertically
    //     color: 'grey',
    //     lineHeight: '10px',
    //     textAlign: 'center',
    // };

    // Assuming contentStyle is defined elsewhere
    const contentStyle = {
        display: 'flex',
        flexDirection: 'column', // Vertically align items
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        margin: '3%',
    };

    return (
        <Carousel arrows infinite={false} style={{ width: '100%', height: 'inherit' }}>

            <div style={contentStyle}>
                <h3 style={{margin:'3%'}}>Drag and drop items</h3>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'5%'}}>
                    <Image preview={false} width="70%" src={dragdroptutorial} />
                    <Divider type="vertical"></Divider>
                    <p>Hold and drag from the sidebar to put network components on the map</p>
                </div>
            </div>

            <div style={contentStyle}>
                <h3 style={{margin:'3%'}}>Create lines between two components</h3>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'5%', paddingTop:'5%'}}>
                    <Image preview={false} width="30%" src={makelinetutorial} />
                    <Divider type="vertical"/>
                    <div style={{display:'flex', flexDirection: 'column'}}>
                        <p>Click on a component to select it</p>
                        <p>Next, click on a compatible component to create a connection between the two</p>
                    </div>
                </div>
            </div>

            <div style={contentStyle}>
                <h3 style={{margin:'3%'}}>Connect items using the bus component</h3>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'5%', paddingTop:'5%'}}>
                    <Image preview={false} width="40%" src={connectwithbuses} />
                    <Divider type="vertical"/>
                    <div style={{display:'flex', flexDirection: 'column'}}>
                        <p>Certain elements need to connect through a bus</p>
                        <p>Blue lines indicate direct connections</p>
                        <p>Grey and Colorful lines indicate physical lines, these are only found between two buses</p>
                        <p>yeah</p>
                    </div>
                </div>
            </div>

        </Carousel>
    );
}
