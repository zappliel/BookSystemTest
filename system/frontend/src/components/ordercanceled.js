import React from "react";
import { useState } from "react";
import { Button, Result } from 'antd';

function OrderCanceledView(){
    const handleButtonClick =()=>{
        window.location.href="dashboardPage";
    }
    return(
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
  <Result
    title="Your operation has been canceled"
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