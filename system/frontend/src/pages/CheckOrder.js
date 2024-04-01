import React, {useEffect,useState} from "react";
import styled from "styled-components";
import NewSideBar from '../components/recon/NewSideBar'
import HeaderOfEdit from "../components/recon/HeaderOfEdit";
import Footer from "../components/Footer";
import ReadInput from "../components/recon/ReadInput";
import { useParams} from "react-router-dom";
import axios from "axios";
import { backendPort } from "../global/global";
import {MDBContainer} from "mdb-react-ui-kit";

const NavItem = styled.li`
    margin: 0;
    padding: 30px;
`;

export default function CheckOrder() {
    // 根据number去后端请求响应数据
    const { order_id } = useParams();
    const [orderInfo, setOrderInfo] = useState({});
    const pagetoken = localStorage.getItem('Token');


//     const order_id = useParams().order_id
//     console.log(order_id)
//     let orderInfo = {};
//     {/*const {orderInfo} = useLocation()
// console.log(orderInfo)*/}

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
                //orderInfo = data;
                setOrderInfo(data);
                console.log("checkorderfetch,", orderInfo, data);
            })
            .catch(error => {
                // 处理请求错误
                console.error(error);
            });
    };

    useEffect(() => {
        // 请求订单数据
        fetchPreviousDayOrder();
    }, []);

    if (pagetoken  === '') {
        // 如果new_token为空，则重定向到404页面
        return (
            <div>
                <h1>Page not found.</h1>
            </div>
        );
    }else{
        return (
            <div>
                <HeaderOfEdit />
                <NewSideBar order_id={order_id}/>
                <div className="input-header">
                    <ReadInput label={orderInfo.order_id} name="订单编号"/>
                </div>
                <div className="input-body">
                    <ReadInput label={orderInfo.seller_id} name="卖方ID"/>
                </div>
                <div className="input-end">
                    <ReadInput label={orderInfo.buyer_id} name="买方ID"/>
                </div>

            </div>
        );
    }

}
