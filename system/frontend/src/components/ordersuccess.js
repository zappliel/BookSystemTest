import React, { Component } from "react";
import { useState } from "react";
import { Button, Result } from 'antd';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
;

function OrderSuccessView(){
        const { state } = useLocation()
      const handleButtonClick =()=>{
            window.location.href="dashboardPage";
        }
        return(
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
            <Result
                status="success"
                title="Successfully Booked!"
                subTitle={"Order number: "+state.id+" Cloud server configuration takes 1-5 minutes, please wait."}
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