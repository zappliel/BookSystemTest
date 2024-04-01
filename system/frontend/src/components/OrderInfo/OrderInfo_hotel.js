import React, { Component } from "react";
import { useState } from "react";
import { Card,Button,Input } from "antd";
import { Link,Navigate,useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import Password from "antd/es/input/Password";
import {backendPort} from "../../global/global";
import moment from "moment";
import { useEffect } from "react";



export default function OrderInfo_hotel (){    
    const [data,setDate]=useState([])
    const Id=6
    // const get_state = useLocation()
    useEffect(()=> {
        fetch('http://localhost:8080/order/query?service_id=8')
        .then((res) =>res.json())
        .then((data)=>setDate(data))
        .catch(err => {
            console.error(err)
        })
    },[]);
        const navigate = useNavigate()

        const handleButtonClick=()=>
        {
            const post_data={
                delta:data.price,
                paymentPassword:Input.TextArea.value
            }
            const Token = localStorage.getItem('Token');
            console.log(Token);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
    
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(post_data),
                redirect: 'follow'
            };
            fetch(`http://${backendPort}/api/v1/user/reset-payment-password`, requestOptions)
                .then(reponse => reponse.json())
                .then(result => {
                    console.log(result);
                    if(result.statusCode == 'SUCCESS'){
                        navigate('../ordersuccess')
                    }else{
                        navigate('../ordererrer')
                    }
                })
                .catch(error => console.log('error', error));
    
        }
        const handleCancel=()=>{
            navigate('../ordercanceled')              
        }
        return (
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
                <Card 
                    className="text-center"
                    title = "订单信息"
                    bordered={false}
                    style={{
                        width: 300,
                    }}
                >
                    <div>
                        <div>
                            <p>Room_id:0405</p>
                            {/* <p>Room_id:{data.payload.substring(0,4)}</p>
                            /* <p>Check_in:{moment(Number(data.payload.substring(5,18)*1000)).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p>Check_out:{moment(Number(data.payload.substring(19,32)*1000)).format("YYYY-MM-DD HH:mm:ss")}</p> */} 
                            <p>Room_Class:King</p>
                            {/* <p>Customer_id:{data.customer_id}</p> */}
                            <p>Price:456.02</p>
                        </div>
                    </div>
                    <div>
                        <p>Please input your password</p>
                    </div>
                    <div>
                    <Input placeholder="Basic usage" />
                    </div>
                    <Button type="primary" onClick={handleButtonClick}>
                    yes
                    </Button>
                    <Button type="secondary" onClick={handleCancel}>
                    no
                    </Button>
                </Card>
            </div>
        )
    
    

    // const handleButtonClick = () => {
    //     setoinfo(true);
    //     window.location.href="ordercanceled";
    // };

    // const handleCancel = () => {
    //     setoinfo(false);
    //     history.back();
    // }
        

}

