import React from "react";
import { useState } from "react";
import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

function OrderCanceledView(){
  const navigate=useNavigate()
    const handleButtonClick =()=>{
        navigate('/homePage')
    }
    return(
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
  <Result
    title="你的订单已经取消！"
    extra={
      <Button type="primary" onClick={handleButtonClick}>
        OK
      </Button>
    }
  />         
        </div>
    )
}

export default OrderCanceledView;