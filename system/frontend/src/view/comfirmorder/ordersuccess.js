import React, { Component } from "react";
import { useState } from "react";
import { Button, Result } from 'antd';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function OrderSuccessView(){
    const navigate = useNavigate()
        const handleButtonClick =()=>{
            navigate("/homePage");
        }
        return(
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
            <Result
                status="success"
                title="Successfully Booked!"
                subTitle={"订单支付成功！"}
                extra={[
                    <Button type="primary" onClick={handleButtonClick}>
                        OK 
                    </Button>,
                ]}
            />            
            </div>
        )        
}
export default OrderSuccessView;