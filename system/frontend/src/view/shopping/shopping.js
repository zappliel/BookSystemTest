import React from "react";
import Header from "../../components/Header";
import Goodshow from "../../components/goodshow/goodshow";
import './shopping.css';

const Shopping = () =>
{
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    
    const locate_goodshow={
        top:`${pageHeight*0.2}px`,
        left:`${pageWidth*0.03}px`
    }
    const size_goodshow={
        width:`${pageWidth*0.9}px`,
        height:"auto"
    }

    return(
        <div style={{position:'absolute',height:`${pageHeight}px`,width:`${pageWidth}px`,display:'flex',flexDirection:'column'}}>
            <div style={{position:'absolute',top:'0px',width:'100%'}}>
                <Header/>
            </div>
            <Goodshow locate={locate_goodshow} size={size_goodshow}/>
        </div>
    );
}

export default Shopping;