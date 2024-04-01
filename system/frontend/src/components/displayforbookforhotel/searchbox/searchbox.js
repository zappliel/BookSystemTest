
import React, { useState } from "react";
import './searchbox.css'
import { useRef } from "react";

function Searchbox(props)
{
    const {tipnote,locate,width} = props;
    const [content,setcontent] = useState("");
    const inputRef = useRef(null);
    function handlesearch()
    {
        const inputValue = inputRef.current.value;
        setcontent(inputValue);
        props.onMessage(content);
        //alert(inputValue);
    }
    function handleKeyDown(event)
    {
        if(event.key === 'Enter'){
            handlesearch();
        }
    }
    return(
        <div style={{...locate,width:width}} className="searchbox">
            <input placeholder={tipnote} ref={inputRef} onKeyDown={handleKeyDown}/>
            <img onClick={handlesearch} src='../../../images/search.svg' alt='error' className="startsearch" title="点击/回车搜索"/>
        </div>
    );
}

export default Searchbox;