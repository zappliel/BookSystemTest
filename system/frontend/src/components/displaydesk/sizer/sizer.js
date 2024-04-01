
import React from "react"
import './sizer.css'
import SizerDropdown from "./sizerdropdown/sizerdropdown"

function Sizer(props)
{
    const {locate} = props;
    return(
        <div style={{...locate}} className="sizerbutton">筛选器<img src = '../../../images/sizer.svg' alt="error"/>
            <SizerDropdown onState={props.onState} onPrice={props.onPrice} onTime={props.onTime}/>
        </div>
    )
}

export default Sizer;