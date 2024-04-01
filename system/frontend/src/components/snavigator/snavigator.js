import React, { useState } from "react";
import { NavLink, useMatch, useNavigate } from 'react-router-dom';
import Popup from "../popup/popup";
import "./snavigator.css";

const backendPort = '10.188.36.53:8080';
const Snavigator = () => {
    const componentstyle={
        position:'absolute',
        left:'0px',
        top:'0px'
    }
    var username = 'Li Hua';
    const pageHeight = window.innerHeight;
    const matchReference = useMatch("/sreference");
    const matchGood = useMatch("/sgood/*");
    const matchOrder = useMatch("/sorder/*");

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    function ExitConfirm()
    {
        setShowModal(true);
    }
    function Closepopup()
    {
        setShowModal(false);
    }
    const Logout = () => {
        const Token = localStorage.getItem('Token');
        console.log(Token);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${Token}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://${backendPort}/api/v1/public/logout`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    localStorage.setItem('Token', '');
                    localStorage.setItem('avatarUuid', '');
                    localStorage.setItem('balance', '0');
                    localStorage.setItem('cardId', '');
                    localStorage.setItem('emailAddress', '');
                    localStorage.setItem('phoneNo', '');
                    localStorage.setItem('realName', '');
                    localStorage.setItem('role', '');
                    localStorage.setItem('status', '');
                    localStorage.setItem('userId', '');
                    localStorage.setItem('username', '');
                    localStorage.setItem('vip', '');
                    window.location.assign("./");
                    /*localStorage.removeItem('Token');
                    localStorage.removeItem('avatarUuid');
                    localStorage.removeItem('cardId');
                    localStorage.removeItem('emailAddress');
                    localStorage.removeItem('phoneNo');
                    localStorage.removeItem('realName');
                    localStorage.removeItem('role');
                    localStorage.removeItem('status');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    localStorage.removeItem('vip');*/
                }else{

                }
            })
            .catch(error => console.log('error', error));
    }
    const my_link_style = {
        height:`${pageHeight*0.08}px`
    }
    return(
        <div style={componentstyle} className="nav-container">
            <div style={{fontSize:'25px',fontWeight:'bold',fontFamily:'Microsoft Yahei',marginTop:`${pageHeight*0.05}px`,marginBottom:`${pageHeight*0.02}px`}}>
                <p>个 人 中 心 </p>
            </div>
            <span className="exit" onClick={ExitConfirm}>退     出</span>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div className="nav-portrait">
                    <img src={ process.env.PUBLIC_URL + '../../../images/portrait.jpg'} alt="图片错误"/>
                </div>
                <div className="nav-username">
                    <p>{username}</p>
                    <p className="identity">卖家</p>
                </div>
            </div>
            
            <ul className="nav-list"> 
                <li className={matchReference?"target-li":"my-link"} style={my_link_style} >
                    <NavLink to='/sreference' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>个人资料</NavLink>
                </li>
                <li style={my_link_style} className={matchGood?"target-li":"my-link"}>
                    <NavLink to='/sgood' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>我的货品</NavLink>
                </li>
                <li style={my_link_style} className={matchOrder?"target-li":"my-link"}>
                    <NavLink to='/sorder' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>订单查询</NavLink>
                </li>
            </ul>
           
            {showModal&&
            <Popup title={"退出确认"}>
                <button onClick={Closepopup} style={{left:'40px'}}>取消</button>
                <button onClick={Logout} style={{right:'40px'}}>确认</button>
                <p>是否确认退出登录？</p>
            </Popup>}
        </div>
    );
}

export default Snavigator;