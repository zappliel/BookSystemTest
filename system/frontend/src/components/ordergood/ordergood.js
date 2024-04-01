
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { backendPort } from "../../global/global";
import Displaydesk from "../displaydesk/displaydesk";
import Popup from "../popup/popup";
import './ordergood.css';

function Ordergood(){
    const curId = localStorage.getItem('userId');//========================================================================
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const spanstyle = {
        height:`${pageHeight * 0.05}px`
    }
    const navigate = useNavigate();
    const [pay,setpay] = useState(false);
    const [cancel,setcancel] = useState(false);
    const [complaint,setcomplaint] = useState(false);
    const [showrefund,setshowrefund] = useState(false);
    const [done,setdone] = useState(false);

    let [refund,setrefund] = useState(false);
    let [readypay,setreadypay] = useState(false);
    let [confirm,setconfirm] = useState(false);
    let [finished,setfinished] = useState(false);
    const [length,setlength] = useState(0);

    const[statecolor,setStatecolor] = useState();
    const [orders,setOrder] = useState([]);
    const [message, setMessage] = useState("");
    const [stateFilter,setstateFilter] = useState(0);
    const [priceFilter,setpriceFilter] = useState(0);
    const [timeFilter,settimeFilter] = useState(0);

    const columnstyle = {
        display:'flex',
        flexDirection:'column',
        position:'absolute',
        top:`${pageHeight * 0.05}px`,
        left:`${pageWidth * 0.26}px`,
        width:`${pageWidth * 0.65}px`,
        height:`${pageHeight * 0.9}px`,
    };
    const rowstyle = {
        display:'flex',
        flexDirection:'row',
        fontSize:'15px',
        height:'8%',
        borderBottom:'1px solid rgba(0,0,0,0.1)'
    };
    const titlestyle = {
        display:'flex',
        alignItems:'center',
        width:'20%',
        height:'100%',
        letterSpacing:'2px',
        fontSize:'16px',
        fontWeight:'bold'
    }
    const contentstyle = {
        display:'flex',
        alignItems:'center',
        width:'80%',
        height:'100%',
        letterSpacing:'1px',
        fontSize:'16px'
    }
    const buttonsstyle = {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        height:'18%',
        width:'100%',
    }

    const buttonstyle = {
        position:'absolute',
        height:'5%',
        width:'20%',
        border:'none',
        borderRadius:'20px',
        fontSize:'15px'
    }
    const labelstyle={
        fontSize:'15px',
        width:'90px',
        letterSpacing:'2px'
    }
    function Return(){
        return navigate('/order/good');
    }
    function checkLength() {
        //var currentLength = document.getElementById("myTextarea").value.length;
        //setlength(currentLength);
    }
    const handleMessage = (msg) => {
        setMessage(msg);
    };
    const handleState = (state) => {
        setstateFilter(state);
    };
    const handlePrice= (price) => {
        setpriceFilter(price);
    };
    const handleTime = (time) => {
        settimeFilter(time);
    };
    useEffect(() => {
        if(message != "" || stateFilter != 0 || priceFilter != 0 || timeFilter != 0){
            let params = new URLSearchParams();
            if(message != "")
                params.set('name',message);
            if(stateFilter != 0)
                params.set('state',stateFilter.toString());
            if(priceFilter != 0)
                params.set('price',priceFilter.toString());
            if(timeFilter != 0)
                params.set('time',timeFilter.toString());
            params.set('buyer',curId.toString());//只显示当前id的订单
            let url = `http://localhost:8080/order/find?${params.toString()}`
            fetch(url)
                .then((response) => response.json())
                .then((orders) => setOrder(orders))
                .catch((error) => console.error(error));
        }else{
            let url = "http://localhost:8080/order/find?buyer="+curId;
            fetch(url)
                .then((response) => response.json())
                .then((orders) => setOrder(orders))
                .catch((error) => console.error(error));
        }
    }, [message,stateFilter,priceFilter,timeFilter]);


    function Gotospecific(index){
        return function(){
            navigate('./showorder'+ "?index=" + index.toString());
        };
    }

    function getState(state){
        if(state == 1){
            return (<span className="state" style={{color:'red'}}>待付款</span>);
        }
        if(state == 2){
            return (<span className="state" style={{color:'blue'}}>待发货</span>);
        }
        if(state == 3){
            return (<span className="state" style={{color:'green'}}>运输中</span>);
        }
        if(state == 4){
            return (<span className="state" style={{color:'black'}}>已收货</span>);
        }
        if(state == 5){
            return (<span className="state" style={{color:'black'}}>待退款</span>);
        }
        if(state == 6){
            return (<span className="state" style={{color:'pink'}}>已退款</span>);
        }
        if(state == 7){
            return (<span className="state" style={{color:'black'}}>退款取消</span>);
        }
        if(state == 8){
            return (<span className="state" style={{color:'purple'}}>订单取消</span>);
        }
    }
    function getTime(time){
        if(time == null)
            return "null";
        else
            return time.replace('T',' ');
    }
    const refreshPage = () => {
        window.location.reload();
    }
    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const refundRef = useRef(null);
    const complainRef = useRef(null);
    function Refund(order){
        //退款
        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=5&refund=" + refundRef.current.value ;
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("操作成功！");
        setshowrefund(false);
        Return();
        refreshPage();
    }
    function Complaint(order){
        //投诉
        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=4&complaint=" + complainRef.current.value;
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("操作成功！");
        setcomplaint(false);
        Return();
        refreshPage();
    }
    function Pay(order){
        //账户表更新======================================================================================================
        const Token = localStorage.getItem('Token');
            console.log(Token);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
            const data = {
                delta: order.money,
                paymentPassword: passwordRef.current.value
            }
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
                body: JSON.stringify(data)
            };
            fetch(`http://${backendPort}/api/v1/user/transfer`, requestOptions)
                .then(reponse => reponse.json())
                .then(result => {
                    console.log(result);
                    if(result.statusCode == 'SUCCESS'){
                        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=2";
                        fetch(url)
                            .then((response) => response.json())
                            .catch((error) => console.error(error));
                        const bal = parseFloat(localStorage.getItem('balance'));
                        localStorage.setItem('balance',(bal-order.money).toString());
                        alert("购买成功！");
                        setpay(false);
                        Return();
                        refreshPage();
                    }else{
                        alert("购买失败：余额不足或账户密码错误！");
                        return;
                    }
                })
                .catch(error => console.log('error', error));
        //================================================================================================================
    }
    function Cancel(order){
        //订单表更新
        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=" + "8"+"&finished="+"1";
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        //商品库存增加
        url = "http://localhost:8080/item/update?id=" + order.productId + "&stock=" + order.num;
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("取消成功！");
        setcancel(false);
        Return();
        refreshPage();
    }
    function Get(order){
        //订单表更新
        let url = "http://localhost:8080/order/update?id=" + order.orderId + "&state=" + "4"+"&finished="+"1";
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("操作成功！");
        setdone(false);
        Return();
        refreshPage();
    }
    function ShowOrder(){
        const location = useLocation();
        const params = queryString.parse(location.search);
        const index = params.index;
        const order = orders[index];
        let state = order.orderState;
        if(state == 1){
            readypay = true;
        }else if(state == 2){
            refund = true;
        }else if(state == 3){
            confirm = true;
        }else if(state == 4 || state == 7){
            finished = true;
        }
        return (
            <div style={columnstyle}>
                <div style={rowstyle}>
                    <span style={titlestyle}>订单号</span>
                    <span style={contentstyle}>{order.orderId}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>商品名</span>
                    <span style={contentstyle}>{order.productName}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>商品数量</span>
                    <span style={contentstyle}>{order.num}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>总金额</span>
                    <span style={contentstyle}>{order.money.toFixed(2)}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>卖家id</span>
                    <span style={contentstyle}>{order.sellerId}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>订单状态</span>
                    <span style={contentstyle}>{getState(order.orderState)}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>创建时间</span>
                    <span style={contentstyle}>{getTime(order.createTime)}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>付款时间</span>
                    <span style={contentstyle}>{getTime(order.payTime)}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>完成时间</span>
                    <span style={contentstyle}>{getTime(order.finishTime)}</span>
                </div>
                <div style={buttonsstyle}>
                    <button onClick={Return} style={buttonstyle} className="leftbutton">返 回</button>
                    {refund || confirm || finished ? <button onClick={() => {
                        setshowrefund(true)
                    }} style={buttonstyle} className="rightbutton">申请退款</button> : null}
                    {readypay ? <button onClick={() => {
                        setpay(true)
                    }} style={buttonstyle} className="middlebutton">立即付款</button> : null}
                    {readypay ? <button onClick={() => {
                        setcancel(true)
                    }} style={buttonstyle} className="rightbutton">取消订单</button> : null}
                    {confirm ? <button onClick={() => {
                        setdone(true)
                    }} style={buttonstyle} className="middlebutton">确认收货</button> : null}
                    {finished ? <button onClick={() => {
                        setcomplaint(true)
                    }} style={buttonstyle} className="middlebutton">投诉</button> : null}
                </div>
                {pay ? <Popup title={"付 款"}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'space-between',
                        height: '85%',
                        width: '90%',
                        marginLeft: '5%',
                        marginRight: '5%'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{fontSize: '15px', letterSpacing: '1px', width: '90px'}}>商 品 名</div>
                            <div style={{fontSize: '15px', width: '140px', overflow: 'clip'}}>{order.productName}</div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{fontSize: '15px', letterSpacing: '1px', width: '90px'}}>总 金 额</div>
                            <img src='../../../images/money.svg' alt='error' style={{height: '15px'}}/>
                            <div
                                style={{fontSize: '25px', marginLeft: '10px', fontWeight: 'bold', color: 'red'}}>{order.money.toFixed(2)}
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{fontSize: '15px', letterSpacing: '1px', width: '90px'}}>账 户 ID</div>
                            <input style={{width: '300px', height: '20px'}} ref={idRef}/>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{fontSize: '15px', letterSpacing: '1px', width: '90px'}}> 密 码</div>
                            <input type={"password"} style={{width: '300px', height: '20px'}} ref={passwordRef}/>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => {
                            setpay(false);
                        }} style={{left: '40px'}}>取消支付
                        </button>
                        <button onClick={() => {
                            Pay(order)
                        }} style={{right: '40px'}}>确认支付
                        </button>
                    </div>
                </Popup> : null}
                {cancel ? <Popup title={"取消订单"} w={"450px"} h={"200px"}>
                    <div>
                        <p>是否确认取消订单？取消后无法恢复</p>
                        <button onClick={() => {
                            setcancel(false)
                        }} style={{left: '40px'}}>取消
                        </button>
                        <button onClick={() => {
                            Cancel(order)
                        }} style={{right: '40px'}}>确认
                        </button>
                    </div>
                </Popup> : null}
                {done ? <Popup title={"确认收货"} w={"450px"} h={"200px"}>
                    <div>
                        <p>是否确认收货？确认后无法更改</p>
                        <button onClick={() => {
                            setdone(false)
                        }} style={{left: '40px'}}>取消
                        </button>
                        <button onClick={() => {
                            Get(order)
                        }} style={{right: '40px'}}>确认
                        </button>
                    </div>
                </Popup> : null}
                {showrefund ? <Popup title={"申请退款"}>
                    <div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'start', width: '100%'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div style={labelstyle}>退款理由</div>
                                {/* <div style={{fontSize: '12px', color: 'gray'}}>{length}/200</div> */}
                            </div>
                            <textarea onInput={checkLength} id='myTextarea' maxLength="200" style={{
                                width: '320px',
                                height: '120px',
                                whiteSpace: 'pre-wrap',
                                resize: 'none',
                                fontSize: '14px'
                            }} ref={refundRef}>
                                    </textarea>
                        </div>
                        <button onClick={() => {
                            setshowrefund(false)
                        }} style={{left: '40px'}}>取消
                        </button>
                        <button onClick={() => {
                            Refund(order)
                        }} style={{right: '40px'}}>提交
                        </button>
                    </div>
                </Popup> : null}
                {complaint ? <Popup title={"投诉"}>
                    <div>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'start', width: '100%'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div style={labelstyle}>投诉内容</div>
                                {/* <div style={{fontSize: '12px', color: 'gray'}}>{length}/500</div> */}
                            </div>
                            <textarea onInput={checkLength} id='myTextarea' maxLength="500" style={{
                                width: '320px',
                                height: '120px',
                                whiteSpace: 'pre-wrap',
                                resize: 'none',
                                fontSize: '14px'
                            }} ref={complainRef}>
                            </textarea>
                        </div>
                        <button onClick={() => {
                            setcomplaint(false)
                        }} style={{left: '40px'}}>取消
                        </button>
                        <button onClick={() => {
                            Complaint(order)
                        }} style={{right: '40px'}}>提交
                        </button>
                    </div>
                </Popup> : null}
            </div>
        );
    }

    return(
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
                                    <span className="num">{i+1}</span>
                                    <span className="order-id">{order.orderId}</span>
                                    <span className="name">{order.productName}</span>
                                    <span className="pay-time">{getTime(order.payTime)}</span>
                                    {getState(order.orderState)}
                                    <div  className="seemore"><span onClick={Gotospecific(i)} className="click">查看详情</span></div>
                                </div>
                            ))}
                        </div>
                    </Displaydesk >
                }/>
                <Route path='/showorder' element={
                    <ShowOrder />
                } />
            </Routes>
        </div>
    );
}

export default Ordergood;