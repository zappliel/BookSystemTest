import React, { useState, useEffect, useReducer } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewSideBar from '../components/recon/NewSideBar';
import ReadInput from '../components/recon/ReadInput';
import WriteInput from '../components/recon/WriteInput';
import '../components/recon/input.css'
import HeaderOfEdit from '../components/recon/HeaderOfEdit';
import { useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import { backendPort } from '../global/global';
import PubSub from "pubsub-js";

export default function Buyer () {
    const {state:{order_id}} = useLocation();
    const [orderInfo, setOrderInfo] = useState({});
    const pagetoken = localStorage.getItem('Token');

    const [, forceRerender] = useReducer(x => x + 1, 0)


    const fetchPreviousDayOrder = () => {
        const Token = localStorage.getItem('Token');
        axios.post(`http://${backendPort}/api/v1/reconciliation/search`, null,{
            params: {
                order_id:order_id
            },
            headers: {
                'Authorization': `Bearer ${Token}`,
                'Content-Type': 'application/json; charset=ISO-8859-1'
            }
        })
            .then(response => {
                // 在这里处理从后端获取到的数据
                const data = response.data;
                setOrderInfo(data);
                return data;
            })
            .catch(error => {
                // 处理请求错误
                console.error(error);
            });
    };

    useEffect(() => {
        // 请求订单数据
        fetchPreviousDayOrder();
        console.log("afterEffect",orderInfo);
        // 订阅余额修改消息
        const mySub = PubSub.subscribe('买方账户余额', correctBuyerBalance);
        console.log("订阅成功")
    }, []);

    const postNewBalance = () => {
        const Token = localStorage.getItem('Token');
        console.log(orderInfo);
        axios.post(`http://${backendPort}/api/v1/reconciliation/updateBalance`, null, {
            params: {
                order_id: order_id,
                object: 0,
                balance: orderInfo.buyer_balance
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

    const correctBuyerBalance = (msgName, newData) => {
        const newOrder = orderInfo;
        newOrder.buyer_balance = newData.newBalance;
        setOrderInfo(newOrder);
        // 把新的balance发送给后端
        postNewBalance();
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
                    <ReadInput label={orderInfo.buyer_id} name="买方ID"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.buyer_name} name="买方用户名"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.product_id} name="商品编号"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.pay_time} name="付款时间"/>
                </div>
                <div className="input-end">
                {orderInfo.state === 0?
                        <ReadInput label={orderInfo.buyer_balance} name="买方账户余额"/>:
                        <WriteInput label={orderInfo.buyer_balance} name="买方账户余额"/>}
                </div>
            </div>
        )
    }

}
