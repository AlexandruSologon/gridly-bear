import { Modal } from "antd";
import {Carousel, Image} from "antd";

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
        margin: 100,
        height: '500px',
        color: 'grey',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#black',
    };

    return (
        <Carousel arrows infinite={false} style={{width:'100%', height:'100%'}}>
            <div style={contentStyle}>
                <h1 style={contentStyle}>ola</h1>
            </div>
            <div style={contentStyle}>
                <h1 style={contentStyle}>ola</h1>
            </div>
            <div style={contentStyle}>
                <h1 style={contentStyle}>ola</h1>
            </div>
        </Carousel>
    )
}
