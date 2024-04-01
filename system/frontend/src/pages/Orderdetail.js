import React, { Component } from "react";
import { useState } from "react";
import { Card,Button } from "antd";
import { Link, useLocation } from "react-router-dom";

function Orderdetail(){    
    const [data,setData] = useState([]);
    const {state} = useLocation();

    fetch('http://localhost:8080/order/query', {
            method: 'GET',
        }).then(res => res.json()).then(data => {
            setData([...data]);
        }).catch(err => {
            console.log(err);
        });
        const renderData = this.state.data.map((data) => {
            return (data.type=="HOTEL"&&data.id==state.id)?(
                <div>
                    <p>type:{data.type}</p>
                    <p>service_id:{data.service_id}</p>
                    <p>price:{data.price}</p>
                    <p>room_id:{data.payload.substring(0,4)}</p>
                    <p>check_in:{data.payload.substring(5,24)}</p>
                    <p>check_out:{data.payload.substring(25,44)}</p>
                </div>
            )                
            :(data.type=="FLIGHT"&&data.id==state.id)?(
                <div>
                    <p>type:{data.type}</p>
                    <p>service_id:{data.service_id}</p>
                    <p>price:{data.price}</p>
                    <p>seat_id:{data.payload}</p>
                </div>                
            ):('')
            })
            return(
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
                <Card 
                    className="text-center"
                    title = "Order Information"
                    bordered={false}
                    style={{
                        width: 300,
                    }}
                >
                   <div>
                        {renderData}
                    </div>
                </Card>
            </div>
            )
}

export default Orderdetail;