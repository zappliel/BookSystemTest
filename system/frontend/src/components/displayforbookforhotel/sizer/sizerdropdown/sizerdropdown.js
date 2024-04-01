import React from "react";
import './sizerdropdownforhotel.css'

function SizerDropdown(props){
    function handleState(i){
        props.onState(i);
    }
    function reSet(){
        props.onState(0);
    }
    return(
        <div>
            <div className="sizer-dropdown">
                <ul>
                    <li style={{color:'gray',fontWeight:'lighter'}} onClick={reSet}>全部重置</li>
                    <li>
                        <span>订单状态</span>
                        <div className="chosenlist">
                            <ul>
                                <li id='s1' onClick={() => handleState(0)}>全部</li>
                                <li id='s2' onClick={() => handleState("UNPAID")}>未支付</li>
                                <li id='s3' onClick={() => handleState("PAID")}>已支付</li>
                                <li id='s4' onClick={() => handleState("CANCELED")}>已取消</li>
                                <li id='s5' onClick={() => handleState("FINISHED")}>已完成</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SizerDropdown;