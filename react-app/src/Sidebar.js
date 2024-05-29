import {Drawer} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import React, {useState} from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

function Draggables({state}) {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {state.sidebarItems.map((item) => (
                <div
                    key={item.id}
                    draggable={true}
                    onDragStart={(event) => state.handleDragStart(event, item)}
                    onDragEnd={state.handleDragEnd}
                    style={{margin: '10px ', cursor: 'grab',width: '96px', height: '96px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                >
                    {/* Container for icon and text */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {/* Render the icon based on item.type */}
                        <img src={state.iconMapping[item.type].options.iconUrl}
                            alt={item.name}
                            style={{width: '64px', height: '64px'}}
                            //sizes={}
                        />
                        {/* Render the text */}
                        <div>    {item.name}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CollapseButton({onSidebarToggle, isSidebarOn}) {
    return (
        <IconButton 
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
                className="KeyboardDoubleArrowRightIcon"
                style={{
                    display: !isSidebarOn ? 'flex' : 'none',
                    width: '30px',
                    height: '30px'
                }}
            />
            <KeyboardDoubleArrowLeftIcon 
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
