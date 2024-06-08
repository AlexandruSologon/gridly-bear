import {Drawer} from "@mui/material";
//import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import React, {useState} from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Button } from "antd";

function SingleDraggable({state, item}) {
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
        data-testid={testid}
        key={item.id}
        draggable={true}
        onDragStart={(event) => state.handleDragStart(event, item)}
        onDragEnd={state.handleDragEnd}
        onMouseEnter={set}
        onMouseLeave={unset}
        style={{
            backgroundColor: mousedOver ? 'rgb(230, 230, 230)' : 'inherit',
            margin: '2px ',
            cursor: 'grab',
            width: '96px',
            height: '96px',
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
                 alt={item.name}
                 style={{
                     width: w,
                     height: h
                 }}
            />
        </div>
        {/* Render the text */}
        <div style={{marginTop: '7px', fontSize: '13px'}}>{item.name}</div>
    </div>);
}

function Draggables({state}) {
    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', marginLeft: 'auto', marginRight:'auto'}}>
            {state.sidebarItems.map((item) => (
                <SingleDraggable state={state} item={item}/>
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
                zIndex: 1001
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
                        width: isSidebarOn ? '210px' : '0' ,
                        textAlign: 'center',
                        transition: 'height 0.3s, width 0.3s',
                        marginLeft: '30px',
                        height:isSidebarOn ? '600px' : '0' ,
                        marginTop: '80px',
                        borderRadius: '8px',
                        boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
                        scrollbarWidth: 'none'
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
                        fontSize: '18px', // Increased font size
                        fontFamily: 'Helvetica, sans-serif', // Changed font family
                        margin: '10px 0', // Added margin for spacing
                        padding: '10px',
                        textAlign: 'left',
                        marginLeft: '10px'
                    }}
                >
                    Drag and drop
                </h2>
                <Draggables state={state}></Draggables>
            </Drawer>
            <CollapseButton onSidebarToggle={onSidebarToggle} isSidebarOn={isSidebarOn}></CollapseButton>
        </div>
    );
}

export default Sidebar;
