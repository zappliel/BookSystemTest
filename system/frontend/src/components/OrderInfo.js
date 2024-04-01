import React, { Component } from "react";
import { useState } from "react";
import { Card,Button } from "antd";
import { Link } from "react-router-dom";


export default class OrderInfo extends Component{    
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }   
    ID=6;
    async componentDidMount() {
        await fetch('http://localhost:8080/order/query', {
            method: 'GET',
        }).then(res => res.json()).then(data => {
            this.setState({data: data});
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const renderData = this.state.data.map((data) => {
            return (data.type=="HOTEL"&&data.id==this.ID)?(
                <div>
                    <p>type:{data.type}</p>
                    <p>service_id:{data.service_id}</p>
                    <p>price:{data.price}</p>
                    <p>room_id:{data.payload.substring(0,4)}</p>
                    <p>check_in:{data.payload.substring(5,24)}</p>
                    <p>check_out:{data.payload.substring(25,44)}</p>
                </div>
            )                
            :(data.type=="FLIGHT"&&data.id==this.ID)?(
                <div>
                    <p>type:{data.type}</p>
                    <p>service_id:{data.service_id}</p>
                    <p>price:{data.price}</p>
                    <p>seat_id:{data.payload}</p>
                </div>                
            ):('')                
            

        });
        const renderid = this.state.data.map((data)=>{return (data.id == this.ID)?(data.service_id.toString()):('')}).join('');

        const handleButtonClick=()=>
        {
            window.location.href="ordersuccess";            
        }
        const handleCancel=()=>{
            window.location.href="ordercanceled";               
        }
        return (
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
                    <Link
                        to={'../ordersuccess'}
                        state={{id:renderid}}
                    >
                    <Button type="primary">
                    yes
                    </Button>
                    </Link>
                    <Button type="secondary" onClick={handleCancel}>
                    no
                    </Button>
                </Card>
            </div>
        )
    }
    

    // const handleButtonClick = () => {
    //     setoinfo(true);
    //     window.location.href="ordercanceled";
    // };

    // const handleCancel = () => {
    //     setoinfo(false);
    //     history.back();
    // }
        

}

