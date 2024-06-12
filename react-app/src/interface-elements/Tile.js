import {TileLayer} from "react-leaflet";
import React from "react";

export default function Tile({opacity}) {
    return (
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
            contributors & <a href="https://carto.com/attributions">CARTO</a>'
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            opacity={opacity}
        />
    )
}