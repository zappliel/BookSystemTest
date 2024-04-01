import React from "react";
import './mainnav.css';

const MainNav = (props) =>{
    const {title,image,subtitle} = props;
    const pageHeight = window.innerHeight;

    const fontSize = `${pageHeight * 0.05}px`;
    const imgsize = `${pageHeight * 0.15}px`;

    const navStyle = {
        fontSize: fontSize,
        width:'100%',
        height:'100%'
    };
    
    const imgStyle = {
        width:imgsize,
        height:imgsize,
    }

    return(
        <div className="mainnav" style={navStyle}>
            <img style={imgStyle} src={`../../${image}`} alt="error"/>
            <p>{title}</p>
            <div className="subtitle">{subtitle}</div>
        </div>
    );
}

export default MainNav;