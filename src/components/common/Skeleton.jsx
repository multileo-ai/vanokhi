import React from "react";
import "./Skeleton.css";

const Skeleton = ({ type = "text", className = "", style = {} }) => {
    const classes = `skeleton skeleton-${type} ${className}`;
    return <div className={classes} style={style}></div>;
};

export default Skeleton;
