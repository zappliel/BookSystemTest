import React from "react";
import { useState } from "react";
import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

function PassworderrView(){
  const navigate=useNavigate()
    const handleButtonClick =()=>{
        navigate('/homePage')
    }
    return(
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
  <Result
    status="warning"
    title="订单支付失败，可能是密码输入错误或者余额不足，请至个人中心-我的订单重新支付。"
    extra={
      <Button type="primary" onClick={handleButtonClick}>
        OK
      </Button>
    }
  />         
        </div>
    )
}

export default PassworderrView;