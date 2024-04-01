import queryString from 'query-string';
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Displaydesk from "../../components/displaydesk/displaydesk";
import Snavigator from "../../components/snavigator/snavigator";
import './sorder.css';


import { backendPort } from "../../global/global";
function Sorder() {
    const curId = localStorage.getItem('userId');
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const spanstyle = {
        height: `${pageHeight * 0.05}px`
    };
    let [refund, setrefund] = useState(false);
    let [readytrans, setreadtrans] = useState(false);

    const columnstyle = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: `${pageHeight * 0.05}px`,
        left: `${pageWidth * 0.26}px`,
        width: `${pageWidth * 0.65}px`,
        height: `${pageHeight * 0.9}px`,
    };
    const rowstyle = {
        display: 'flex',
        flexDirection: 'row',
        fontSize: '15px',
        height: '9%',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
    };
    const titlestyle = {
        display: 'flex',
        alignItems: 'center',
        width: '20%',
        height: '100%',
        letterSpacing: '2px',
        fontSize: '16px',
        fontWeight: 'bold'
    }
    const contentstyle = {
        display: 'flex',
        alignItems: 'center',
        width: '80%',
        height: '100%',
        letterSpacing: '1px',
        fontSize: '16px'
    }
    const content1style = {
        display: 'flex',
        alignItems: 'center',
        width: '80%',
        height: '100%',
        letterSpacing: '1px',
        fontSize: '16px',
        overflow: 'auto'
    }
    const buttonsstyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '18%',
        width: '100%',
    }

    const buttonstyle = {
        position: 'absolute',
        height: '5%',
        width: '20%',
        border: 'none',
        borderRadius: '20px',
        fontSize: '15px'
    }
    const navigate = useNavigate();

    const [orders, setOrder] = useState([]);
    const [message, setMessage] = useState("");
    const [stateFilter, setstateFilter] = useState(0);
    const [priceFilter, setpriceFilter] = useState(0);
    const [timeFilter, settimeFilter] = useState(0);

    const handleMessage = (msg) => {
        setMessage(msg);
    };
    const handleState = (state) => {
        setstateFilter(state);
    };
    const handlePrice = (price) => {
        setpriceFilter(price);
    };
    const handleTime = (time) => {
        settimeFilter(time);
    };
    const refreshPage = () => {
        window.location.reload();
    }
    let state = 1;
    useEffect(() => {
        if (message != "" || stateFilter != 0 || priceFilter != 0 || timeFilter != 0) {
            let params = new URLSearchParams();
            if (message != "")
                params.set('name', message);
            if (stateFilter != 0)
                params.set('state', stateFilter.toString());
            if (priceFilter != 0)
                params.set('price', priceFilter.toString());
            if (timeFilter != 0)
                params.set('time', timeFilter.toString());
            params.set('seller', curId.toString());
            let url = `http://localhost:8080/order/find?${params.toString()}`
            fetch(url)
                .then((response) => response.json())
                .then((orders) => setOrder(orders))
                .catch((error) => console.error(error));
        } else {
            fetch("http://localhost:8080/order/find?seller=" + curId.toString())
                .then((response) => response.json())
                .then((orders) => setOrder(orders))
                .catch((error) => console.error(error));
        }
    }, [message, stateFilter, priceFilter, timeFilter, state]);

    function getState(state) {
        if (state == 1) {
            return (<span className="state" style={{ color: 'red' }}>待付款</span>);
        }
        if (state == 2) {
            return (<span className="state" style={{ color: 'blue' }}>待发货</span>);
        }
        if (state == 3) {
            return (<span className="state" style={{ color: 'green' }}>运输中</span>);
        }
        if (state == 4) {
            return (<span className="state" style={{ color: 'black' }}>已收货</span>);
        }
        if (state == 5) {
            return (<span className="state" style={{ color: 'black' }}>待退款</span>);
        }
        if (state == 6) {
            return (<span className="state" style={{ color: 'pink' }}>已退款</span>);
        }
        if (state == 7) {
            return (<span className="state" style={{ color: 'black' }}>退款取消</span>);
        }
        if (state == 8) {
            return (<span className="state" style={{ color: 'purple' }}>订单取消</span>);
        }
    }
    function getTime(time) {
        if (time == null)
            return "null";
        else
            return time.replace('T', ' ');
    }

    function Gotospecific(index) {
        return function () {
            navigate('./showsorder' + "?index=" + index.toString());
        };
    }
    function Return() {
        return navigate('/sorder');
    }
    function Refund(order) {
        // 退款
        //订单表更新
        if (order.orderState != 5) {
            alert("订单无需退款");
            return;//必须要为待退款状态
        }

        const Token = localStorage.getItem('Token');
        console.log(Token);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${Token}`);
        myHeaders.append("Content-Type", "application/json");
        const data = {
            delta: order.money,
            userId: order.buyerId
        }
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(data)
        };
        fetch(`http://${backendPort}/api/v1/user/received`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {

                console.log(result);
                if (result.statusCode == 'SUCCESS') {
                    let params = new URLSearchParams();
                    params.set('id', order.productId);
                    params.set('buyerId', order.buyerId);
                    params.set('num', order.num);
                    params.set('state', "2");
                    params.set('money', (order.money).toString());
                    let url = `http://localhost:8080/order/insert?${params.toString()}`
                    fetch(url)
                        .then((response) => response.json())
                        .catch((error) => console.error(error));
                } else {
                    alert("操作失败");
                    return;
                }
            })
            .catch(error => console.log('error', error));

        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=" + "6" + "&finished=" + "1";
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        //商品表更新
        url = "http://localhost:8080/item/update?id=" + order.productId + "&stock=" + order.num;
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("操作成功！");
        Return();
        refreshPage();
    }
    function Reject(order) {
        if (order.orderState != 5) {
            alert("订单无需退款");
            return;//必须要为待退款状态
        }
        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=" + "7";
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("操作成功！");
        Return();
        refreshPage();
    }
    function Express(order) {
        //发货
        if (order.orderState != 2) {
            alert("订单需要为待发货状态");
            return;//必须要为待发货状态
        }
        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=" + "3";
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("操作成功！");
        Return();
        refreshPage();
    }
    function ShowSorder() {
        const location = useLocation();
        const params = queryString.parse(location.search);
        const index = params.index;
        const order = orders[index];
        let [showcomplaint, Setshowcomplaint] = useState(false);
        let showrefund = false;
        if (order.orderState == 5) {
            refund = true;
        } else if (order.orderState == 2) {
            readytrans = true;
        }
        if (order.complaint != null)
            showcomplaint = true;
        if (order.refund != null)
            showrefund = true;
        return (
            <div style={columnstyle}>
                <div style={rowstyle}>
                    <span style={titlestyle}>订单号</span>
                    <span style={contentstyle}>{order.orderId}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>商品名</span>
                    <span style={contentstyle}>{order.productName}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>商品数量</span>
                    <span style={contentstyle}>{order.num}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>总金额</span>
                    <span style={contentstyle}>{order.money.toFixed(2)}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>买家id</span>
                    <span style={contentstyle}>{order.buyerId}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>订单状态</span>
                    <span style={contentstyle}>{getState(order.orderState)}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>创建时间</span>
                    <span style={contentstyle}>{getTime(order.createTime)}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>付款时间</span>
                    <span style={contentstyle}>{getTime(order.payTime)}</span>
                </div>
                <div style={rowstyle}>
                    <span style={titlestyle}>完成时间</span>
                    <span style={contentstyle}>{getTime(order.finishTime)}</span>
                </div>
                {showcomplaint &&
                    <div style={rowstyle}>
                        <span style={titlestyle}>投诉信息</span>
                        <span style={content1style}>{order.complaint}</span>
                    </div>
                }
                {showrefund &&
                    <div style={rowstyle}>
                        <span style={titlestyle}>退款原因</span>
                        <span style={content1style}>{order.refund}</span>
                    </div>
                }
                <div style={buttonsstyle}>
                    <button onClick={Return} style={buttonstyle} className="leftbutton">返 回</button>
                    {readytrans ? <button style={buttonstyle} className="rightbutton" onClick={() => Express(order)}>确认发货</button> : null}
                    {refund ? <button style={buttonstyle} className="middlebutton" onClick={() => Refund(order)}>同意退款</button> : null}
                    {refund ? <button style={buttonstyle} className="rightbutton" onClick={() => Reject(order)}>拒绝退款</button> : null}
                </div>
            </div>
        );
    }
    return (
        <div>
            <Routes>
                <Route path='/' element={
                    <Displaydesk onMessage={handleMessage} onState={handleState} onPrice={handlePrice} onTime={handleTime}>
                        <div className="ordergood">
                            <div style={spanstyle} className="list-title">
                                <span className="num">序号</span>
                                <span className="order-id">订单号</span>
                                <span className="name">商品名</span>
                                <span className="pay-time">付款时间</span>
                                <span className="state">订单状态</span>
                                <span className="count">当前共 {orders.length} 条</span>
                            </div>
                            {orders.map((order, i) => (
                                <div style={spanstyle} className="showlist">
                                    <span className="num">{i + 1}</span>
                                    <span className="order-id">{order.orderId}</span>
                                    <span className="name">{order.productName}</span>
                                    <span className="pay-time">{getTime(order.payTime)}</span>
                                    {getState(order.orderState)}
                                    <div className="seemore"><span onClick={Gotospecific(i)} className="click">查看详情</span></div>
                                </div>
                            ))}
                        </div>
                    </Displaydesk >
                } />
                <Route path='/showsorder' element={<ShowSorder />} />
            </Routes>
            <Snavigator style={{ zIndex: 999 }} />
        </div>
    );
}

export default Sorder;