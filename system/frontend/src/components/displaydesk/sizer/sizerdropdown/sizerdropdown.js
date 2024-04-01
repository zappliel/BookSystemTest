import React from "react";
import './sizerdropdown.css';

function SizerDropdown(props) {
    function handleState(i) {
        for (var j = 0; j < 5; j++) {
            if (j == i) {
                document.getElementById(`s${j + 1}`).style.backgroundColor = "rgba(0,0,0,0.1)";
            }
            else {
                document.getElementById(`s${j + 1}`).style.backgroundColor = "white";
            }
        }
        props.onState(i);
    }
    function handlePrice(i) {
        for (var j = 0; j < 5; j++) {
            if (j == i) {
                document.getElementById(`m${j + 1}`).style.backgroundColor = "rgba(0,0,0,0.1)";
            }
            else {
                document.getElementById(`m${j + 1}`).style.backgroundColor = "white";
            }
        }
        props.onPrice(i);
    }
    function handleTime(i) {
        for (var j = 0; j < 5; j++) {
            if (j == i) {
                document.getElementById(`t${j + 1}`).style.backgroundColor = "rgba(0,0,0,0.1)";
            }
            else {
                document.getElementById(`t${j + 1}`).style.backgroundColor = "white";
            }
        }
        props.onTime(i);
    }
    function reSet() {
        props.onState(0);
        props.onPrice(0);
        props.onTime(0);
        for (var j = 0; j < 5; j++) {
            document.getElementById(`t${j + 1}`).style.backgroundColor = "white";
            document.getElementById(`m${j + 1}`).style.backgroundColor = "white";
            document.getElementById(`s${j + 1}`).style.backgroundColor = "white";
        }
    }
    return (
        <div>
            <div className="sizer-dropdowng">
                <ul>
                    <li style={{ color: 'gray', fontWeight: 'lighter' }} onClick={reSet}>全部重置</li>
                    <li>
                        <span>订单状态</span>
                        <div className="chosenlist">
                            <ul>
                                <li style={{ color: 'black', background: 'rgba(0,0,0,0.1)' }} id='s1' onClick={() => handleState(0)}>全部</li>
                                <li style={{ color: 'black' }} id='s2' onClick={() => handleState(1)}>待支付</li>
                                <li style={{ color: 'black' }} id='s3' onClick={() => handleState(2)}>待发货</li>
                                <li style={{ color: 'black' }} id='s4' onClick={() => handleState(3)}>运输中</li>
                                <li style={{ color: 'black' }} id='s5' onClick={() => handleState(4)}>已收货</li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span>订单金额</span>
                        <div className="chosenlist">
                            <ul>
                                <li style={{ background: 'rgba(0,0,0,0.1)' }} id='m1' onClick={() => handlePrice(0)}>全部</li>
                                <li id='m2' onClick={() => handlePrice(1)}>¥0~50</li>
                                <li id='m3' onClick={() => handlePrice(2)}>¥50~200</li>
                                <li id='m4' onClick={() => handlePrice(3)}>¥200~500</li>
                                <li id='m5' onClick={() => handlePrice(4)}>大于¥500</li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span>付款时间</span>
                        <div className="chosenlist">
                            <ul>
                                <li style={{ background: 'rgba(0,0,0,0.1)' }} id='t1' onClick={() => handleTime(0)}>全部</li>
                                <li id='t2' onClick={() => handleTime(1)}>今日</li>
                                <li id='t3' onClick={() => handleTime(2)}>7日内</li>
                                <li id='t4' onClick={() => handleTime(3)}>7~15日</li>
                                <li id='t5' onClick={() => handleTime(4)}>15日前</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SizerDropdown;