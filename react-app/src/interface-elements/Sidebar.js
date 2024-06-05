import {Drawer} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import React, {useState} from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

function SingleDraggable({state, item}) {

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
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100vh'}}>
            {/* Render the icon based on item.type */}
            <img src={state.iconMapping[item.type].options.iconRetinaUrl}
                 alt={item.name}
                 style={{
                     width: state.iconMapping[item.type].options.iconSize[0],
                     height: state.iconMapping[item.type].options.iconSize[1],
                 }}
            />
            {/* Render the text */}
        </div>
        <div>{item.name}</div>
    </div>);
}

function Draggables({state}) {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {state.sidebarItems.map((item) => (
                <SingleDraggable state={state} item={item}/>
            ))}
        </div>
    );
}



function CollapseButton({onSidebarToggle, isSidebarOn}) {
    return (
        <IconButton
            data-testid="retract-sidebar"
            style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                left: '100px',
                top: '0px',
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
        </IconButton>
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
                        backgroundColor: "rgba(253, 253, 253, 0.7)",
                        color: "#000",
                        width: '150px',
                        textAlign: 'center'
                    }
                }}
                style={{
                    display: isSidebarOn ? 'grid' : 'none',
                    position: 'absolute',
                    zIndex: 1000,
                }}
                variant="permanent"
                anchor="bottomleft"
            >
                <div style={{height: '3%'}}></div>
                <h2 style={{
                        fontSize: '16px', // Increased font size
                        fontFamily: 'Helvetica, sans-serif', // Changed font family
                        margin: '10px 0', // Added margin for spacing
                    }}
                >
                    Drag & Drop
                </h2>
                <Draggables state={state}></Draggables>
            </Drawer>
            <CollapseButton onSidebarToggle={onSidebarToggle} isSidebarOn={isSidebarOn}></CollapseButton>
        </div>
    );
}

export default Sidebar;
