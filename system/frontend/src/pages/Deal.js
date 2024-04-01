import React, { useState, useReducer, useEffect } from 'react';
import {
  MDBContainer,
} from 'mdb-react-ui-kit';
import Footer from "../components/Footer";
import NewSideBar from '../components/recon/NewSideBar';
import ReadInput from '../components/recon/ReadInput';
import WriteInput from '../components/recon/WriteInput';
import '../components/recon/input.css'
import HeaderOfEdit from '../components/recon/HeaderOfEdit';
import { Location, useLocation } from "react-router-dom";
import axios from "axios";
import { backendPort } from '../global/global';
import PubSub from "pubsub-js";

export default function Deal (){
    const {state:{order_id}} = useLocation();
    const [orderInfo, setOrderInfo] = useState({});
    const pagetoken = localStorage.getItem('Token');

    const [, forceRerender] = useReducer(x => x + 1, 0)

    const fetchPreviousDayOrder = () => {
        const Token = localStorage.getItem('Token');
        axios.post(`http://${backendPort}/api/v1/reconciliation/search`, null, {
            params: {
                order_id: order_id
            },
            headers: {
                'Authorization': `Bearer ${Token}`,
                'Content-Type': 'application/json; charset=ISO-8859-1'
            }
        })
            .then(response => {
                const data = response.data;
                setOrderInfo(data);
                console.log("dealfetch", orderInfo);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchPreviousDayOrder();
        const mySub = PubSub.subscribe('交易金额', correctDealMoney);
        console.log("订阅成功")
    }, []);


    const postNewMoney = () => {
        const Token = localStorage.getItem('Token');
        axios.post(`http://${backendPort}/api/v1/reconciliation/updateOrder`, null, {
            params: {
                order_id: order_id,
                money: orderInfo.money
            },
            headers: {
                'Authorization': `Bearer ${Token}`,
                'Content-Type': 'application/json; charset=ISO-8859-1'
            }
        })
            .then(response => {
                // 在这里处理从后端获取到的数据
                const data = response.data;
                console.log(data);
                if(data==="修改成功"){
                    console.log("修改成功")
                }else{

                }
            })
            .catch(error => {
                // 处理请求错误
                console.error(error);
            });
    };

    const correctDealMoney = (msgName, newData) => {
        const newOrder = orderInfo;
        newOrder.money = newData.newMoney;
        setOrderInfo(newOrder);
        // 把新的balance发送给后端
        postNewMoney();
        // 强制重新渲染
        // forceRerender();
        window.location.reload();
    };

    if (pagetoken  === '') {
        // 如果new_token为空，则重定向到404页面
        return (
            <div>
                <h1>Page not found.</h1>
            </div>
        );
    }else{
        return(
            <div>
                <HeaderOfEdit/>
                <NewSideBar order_id={order_id}/>
                <div className="input-header">
                    <ReadInput label={orderInfo.order_id} name="订单编号"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.product_id} name="商品编号"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.create_time} name="创建时间"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.pay_time} name="付款时间"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.finish_time} name="结束时间"/>
                </div>
                <div className="input-body">
                    {orderInfo.state === 0?
                        <ReadInput label={orderInfo.money} name="交易金额"/>:
                        <WriteInput label={orderInfo.money} name="交易金额"/>}
                </div>
                <div className="input-end">
                    <ReadInput label={orderInfo.state===0?"Normal":(orderInfo.state===1?"Abnormal":"Attention")} name="订单状态"/>
                </div>

            </div>
        )
    }


}
