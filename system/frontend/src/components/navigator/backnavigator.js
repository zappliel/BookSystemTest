import React from "react";
import "./navigator.css"
import {NavLink} from 'react-router-dom'
import {useMatch} from "react-router-dom";
import { useState } from "react";
import Popup from "../popup/popup";
import { useNavigate } from "react-router-dom";
import {backendPort} from "../../global/global";


const BackNavigator = () => {
    const componentstyle={
        position:'absolute',
        left:'0px',
        top:'0px'
    }
    const new_name=localStorage.getItem('username');
    let username = new_name;
    const pageHeight = window.innerHeight;
    const matchReference = useMatch("/backreference");

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
                    localStorage.setItem('balance', '');
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
                }else{

                }
            })
            .catch(error => console.log('error', error));
    }
    function Linktologin()
    {
        navigate('/');
        setShowModal(false);
    }
    const my_link_style = {
        height:`${pageHeight*0.08}px`
    }
    return(
        <div style={componentstyle} className="nav-container">
            <div style={{fontSize:'25px',fontWeight:'bold',fontFamily:'Microsoft Yahei',marginTop:`${pageHeight*0.05}px`,marginBottom:`${pageHeight*0.02}px`}}>
                <p>管 理 中 心 </p>
            </div>
            <span className="exit" onClick={ExitConfirm}>退     出</span>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div className="nav-portrait">
                    <img src={ process.env.PUBLIC_URL + '../../../images/portrait.jpg'} alt="图片错误"/>
                </div>
                <div className="nav-username">
                    <p>{username}</p>
                    <p className="identity">管理员</p>
                </div>
            </div>

            <ul className="nav-list">
                <li style={my_link_style} className="my-link">
                    <NavLink to='/hotelManagePage' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>酒店管理</NavLink>
                </li>
                <li style={my_link_style} className="my-link">
                    <NavLink to='/flightManagePage' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>航班管理</NavLink>
                </li>
                <li style={my_link_style} className="my-link">
                    <NavLink to='/sproomManagePage' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>特价房管理</NavLink>
                </li>
                <li style={my_link_style} className="my-link">
                    <NavLink to='/ticketManagePage' style={{textDecoration:'none',color:'black',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>折扣机票管理</NavLink>
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

export default BackNavigator;