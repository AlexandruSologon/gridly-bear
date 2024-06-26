import {Drawer} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import React, {useState} from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Button } from "antd";

function SingleDraggable({state, item, isSidebarOn}) {
    const w = '60px';
    const h = '60px';

    const [mousedOver, setMousedOver] = useState(false);
    const testid = "draggable-"+item.type;

    const unset = () => {
        setMousedOver(false);
    }

    const set = (state) => {
        setMousedOver(true);
    }

    return (<div
        key={item.id}
        draggable={true}
        onDragStart={(event) => state.handleDragStart(event, item)}
        onDragEnd={state.handleDragEnd}
        onMouseEnter={set}
        onMouseLeave={unset}
        style={{
            margin: '2px ',
            cursor: 'grab',
            width: isSidebarOn ? '96px' : '0',
            height: isSidebarOn ? '96px' : '0',
            transition: 'height 0.2s, width 0.4s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
    >
        {/* Container for icon and text */}
        <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: h, width: w}}>
            {/* Render the icon based on item.type */}
            <img src={state.iconMapping[item.type].options.iconRetinaUrl}
                data-testid={testid}
                alt={item.name}
                style={{
                    width: isSidebarOn ? w : '0',
                    height: isSidebarOn ? h : '0',
                    transition: 'height 0.4s, width 0.4s',
                    filter: mousedOver ? 'brightness(150%) drop-shadow(0px 0px 7px rgba(25, 49, 101, 0.5))' : 'none'
                 }}
            />
        </div>
        {/* Render the text */}
        <div style={{marginTop: '7px',
                    fontSize: isSidebarOn ? '13px' : '0px' ,
                    transition: 'font-size 0.4s' }}>{item.name}</div>
    </div>);
}

function Draggables({state, isSidebarOn}) {
    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', marginLeft: 'auto', marginRight:'auto'}}>
            {state.sidebarItems.map((item) => (
                <SingleDraggable state={state} item={item} isSidebarOn={isSidebarOn}/>
            ))}
        </div>
    );
}

function CollapseButton({onSidebarToggle, isSidebarOn}) {
    return (
        <Button
            data-testid="retract-sidebar"
            style={{
                transform: 'rotate(90deg)',
                position: 'absolute',
                width: '40px',
                height: '40px',
                left: '30px',
                top: '20px',
                boxShadow: '4px -4px 8px rgba(0, 0, 0, 0.3)',
                zIndex: 1000
            }}
            onClick={onSidebarToggle}
        >
            <KeyboardDoubleArrowRightIcon
                data-testid="retract-sidebar-icon-right"
                className="KeyboardDoubleArrowRightIcon"
                style={{
                    display: !isSidebarOn ? 'flex' : 'none',
                    width: '30px',
                    height: '30px'
                }}
            />
            <KeyboardDoubleArrowLeftIcon
                data-testid="retract-sidebar-icon-left"
                className="KeyboardDoubleArrowLeftIcon"
                style={{
                    display: isSidebarOn ? 'flex' : 'none',
                    width: '30px',
                    height: '30px'
                }}
            />
        </Button>
    );
}

function Sidebar(state) {
    const [isSidebarOn, setIsSidebarOn] = useState(true);

    const onSidebarToggle = () => {
        setIsSidebarOn(!isSidebarOn)
    }

    return (
        <div>
            <Drawer
                data-testid= "sidebar"
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(253, 253, 253, 1)",
                        color: "#000",
                        width: isSidebarOn ? '210px' : '0px' ,
                        textAlign: 'center',
                        transition: 'height 0.3s, width 0.3s',
                        marginLeft: '30px',
                        height:isSidebarOn ? '600px' : '0px' ,
                        marginTop: '80px',
                        borderRadius: '8px',
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
                        scrollbarWidth: 'none',
                        border: 1,
                        borderColor: '#d9d9d9'
                    }
                }}
                style={{
                    display: 'grid',
                    position: 'absolute',
                    zIndex: 1000,
                }}
                variant="permanent"
                anchor="bottomleft"
            >
                <div style={{height: '3%'}}></div>
                <h2 style={{
                        fontSize: isSidebarOn ? '18px' : '0px' ,
                        transition: 'font-size 0.2s' , // Increased font size
                        fontFamily: '-apple-system, system-ui', // Changed font family
                        margin: '10px 0', // Added margin for spacing
                        padding: '10px',
                        textAlign: 'left',
                        marginLeft: '10px'
                    }}
                >
                    Drag and drop
                </h2>
                <Draggables state={state} isSidebarOn={isSidebarOn}></Draggables>
            </Drawer>
            <CollapseButton
                onSidebarToggle={onSidebarToggle}
                isSidebarOn={isSidebarOn}>
            </CollapseButton>
        </div>
    );
}

export default Sidebar;
