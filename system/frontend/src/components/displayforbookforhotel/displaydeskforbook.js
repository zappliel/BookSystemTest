
import React from "react";
import './displaydeskforbook.css'
import Searchbox from "./searchbox/searchbox";
import Sizer from "./sizer/sizer"

function Displaydeskforbookforhotel(props){
    const {children} = props;
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

    const componentstyle={
        position:'relative',
        top:'0px',
        left:'0px',
        width:`${pageWidth}px`,
        height:`${pageHeight}px`
    }
    const locate_searchbox={
        top:`${pageHeight * 0.05}px`,
        left:`${pageWidth * 0.22}px`
    }

    const locate_sizer={
        top:`${pageHeight * 0.05}px`,
        right:`${pageWidth * 0.22}px`
    }

    return(
        <div style={componentstyle} className="deskboard">
            {children}
            <Sizer locate={locate_sizer} style={{zIndex:'888'}} onState={props.onState} />
        </div>
    );
}

export default Displaydeskforbookforhotel;