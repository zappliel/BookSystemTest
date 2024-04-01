import React, { useState } from "react";
import './pricefilter.css';

function Pricefilter(props)
{
    const [clicked1,setClicked1] = useState({});
    const [clicked2,setClicked2] = useState({});
    const {locate} = props;
    const handleClick0 = () => {
        props.onOrder(0);
        setClicked1({});
        setClicked2({});
    };
    const handleClick1 = () => {
        props.onOrder(1);
        setClicked1({
            color:'white',
            backgroundColor:'rgba(0,0,0,0.3)'
        });
        setClicked2({});
    };
    const handleClick2 = () => {
        props.onOrder(2);
        setClicked2({
            color:'white',
            backgroundColor:'rgba(0,0,0,0.3)'
        });
        setClicked1({});
    };
    return(
        <div style={{position:'absolute',...locate}}>
            <p className="pricefilter">价格排序 ▼
                <ul>
                    <li style={{color:'gray'}} onClick={handleClick0}>默认</li>
                    <li style={clicked1} onClick={handleClick1}>由高到低</li>
                    <li style={clicked2} onClick={handleClick2}>由低到高</li>
                </ul>
            </p>

        </div>
    );
}

export default Pricefilter;