import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Popup from "../popup/popup";
import './header.css';


function Header1(props){
    const {username} = props;

    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const width = `${pageWidth}px`;
    const height = `${pageHeight * 0.08}px`;
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    function ExitConfirm()
    {
        setShowModal(true);
    }
    function Closepopup()
    {
        setShowModal(false);
    }
    function Linktologin()
    {
        
        navigate('/sreference');
        setShowModal(false);
    }
    return(
        <div style={{background:'red',width:'1900px',height:height}} className="container">
            <div className="logo">
                <img src={process.env.PUBLIC_URL + 'images/logo.svg'} alt="logo"/>
                <p>在线支付系统</p>
            </div>
            <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'right'}}>
                <p className="greeting" style={{marginRight:'30px'}}>Hello,{username}</p>
                <Link to={`${process.env.PUBLIC_URL}/reference`} className="portrait">
                    <img src={process.env.PUBLIC_URL + 'images/portrait.jpg'} alt="error"/>   
                </Link>
                <p onClick={ExitConfirm} className="exitlogin">退出</p>
            </div>
            {showModal &&
            <Popup title={"退出确认"}>
                <button onClick={Closepopup} style={{left:'40px'}}>取消</button>
                <button onClick={Linktologin} style={{right:'40px'}}>确认</button>
                <p>是否确认退出登录？</p>
            </Popup>
            }
        </div>
    );
}

export default Header1;