import { Divider, Modal, Carousel, Image } from "antd";
import dragdroptutorial from '../images/dragdroptutorial.gif';
import makelinetutorial from '../images/makelinetutorial.gif';
import connectwithbuses from '../images/connectwithbuses.png';
import runbuttonfull from '../images/runbuttonfull.png';
import settingstutorial from '../images/settingstutorial.gif';

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
            <div style={{height: '60vh', overflow:'hidden'}}>
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
        overflow:'hidden'
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
                        <p>Left click on a component to select it</p>
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
                        <p>Elements can only connect through a bus</p>
                        <p>Blue lines indicate direct connections and do not denote physical lines</p>
                        <p>Grey and Colorful lines indicate physical lines, these are only found between two buses</p>
                    </div>
                </div>
            </div>

            <div style={contentStyle}>
                <h3 style={{margin:'3%'}}>Enter parameters for components</h3>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'5%', paddingTop:'5%'}}>
                    <Image preview={false} width="40%" src={settingstutorial} />
                    <Divider type="vertical"/>
                    <div style={{display:'flex', flexDirection: 'column'}}>
                        <p>Right click elements to enter parameters for them</p>
                        <p>'Set as default' to save the current parameters for any new component of the same type</p>
                        <p>Make sure not to leave any parameters empty in order to run your simulation</p>
                        <p style={{color: '#FF0000'}}>Note - Changing line length will not have an effect on the placement of any components. This means that the components' position on the map may not match reality.</p>
                    </div>
                </div>
            </div>

            <div style={contentStyle}>
                <h3 style={{margin:'3%'}}>Run a simulation</h3>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', margin:'5%', paddingTop:'5%'}}>
                    <Image preview={false} width="40%" src={runbuttonfull} />
                    <Divider type="vertical"/>
                    <div style={{display:'flex', flexDirection: 'column'}}>
                        <p>To run a simulation on your network hit 'run'</p>
                        <p>Colors and numbers will indicate the diagnostic status of your components if the simulation was successful</p>
                        <p>If your network did not run because it was invalid, have a look at the alert message at the top of the screen</p>
                        <p>You can view a history of your run simulations and click them to set the canvas back to a previous network</p>
                    </div>
                </div>
            </div>

        </Carousel>
    );
}
