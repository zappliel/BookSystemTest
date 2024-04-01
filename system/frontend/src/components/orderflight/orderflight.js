import React, {useEffect, useRef, useState} from "react";
import './orderflight.css';
import Displaydeskforbookforflight from "../displayforbookforflight/displaydeskforbook";
import Goodcard from "../goodshow/goodcard/goodcard";
import { Routes,Route, useNavigate,useLocation } from "react-router-dom";
import Popup from "../popup/popup";
import queryString from "query-string";
import {backendPort} from "../../global/global";
import { all } from "axios";
import Item from "antd/es/list/Item";
import moment from "moment";

function Orderflight(){
    const curID = localStorage.getItem("userId");
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

    let [unpaid,setunpaid] = useState();
    let [paid,setpaid] = useState();
    let [canceled,setcanceled] = useState();
    let [finished,setfinished] = useState();
    const [length,setlength] = useState(0);
    const [flights,setFlight] = useState([]);
    const [allflight,setAllflight] = useState([]); 

    const [orders,setOrder] = useState([]);
    const [message, setMessage] = useState("");
    const [stateFilter,setstateFilter] = useState("ALL");

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
        return navigate('/order/ticket');
    }
    function checkLength() {
        var currentLength = document.getElementById("myTextarea").value.length;
        setlength(currentLength);
    }
    const handleState = (state) => {
        setstateFilter(state);
    };
    useEffect(() => {
        if(stateFilter != "ALL" ){
            let params = new URLSearchParams();
                params.set('status',stateFilter);
                params.set('type','FLIGHT');
                params.set('customer_id',curID);
            let url = `http://localhost:8080/order/queryFlight?${params.toString()}`
            fetch(url)
                .then((response) => response.json())
                .then((orders) => setOrder(orders))
                .catch((error) => console.error(error));
                console.log(orders);
        }else{
            fetch("http://localhost:8080/order/queryFlight?type=FLIGHT&customer_id="+curID)
                .then((response) => response.json())
                .then((orders) => setOrder(orders))
                .catch((error) => console.error(error));
        }
    }, [stateFilter]);
    useEffect(()=>{
        fetch("http://localhost:8080/flight/query")
        .then((response)=>response.json())
        .then((allflight) => setAllflight(allflight))
        .catch((error)=>console.error(error));
        console.log(allflight);
    },[]);
    function getDTime (record) {
        return allflight.map((item,index)=>{
            if(item.id === record.service_id)
            {    
                console.log("DTime"+item.departureTime);
                return moment(item.departureTime).format('YYYY-MM-DD HH:mm');
                }
        })
    }
    function getATime (record) {
        return allflight.map((item,index)=>{
            if(item.id === record.service_id)
                return moment(item.arrivalTime).format('YYYY-MM-DD HH:mm');
        })
    }
    function Gotospecific(index){
        return function(){
            navigate('./showorder'+ "?index=" + index.toString());
        };
    }

    function getStatus(state){
        if(state == "UNPAID")
            return "未支付";
        if(state == "PAID")
            return "已支付";
        if(state == "CANCELED")
            return "已取消";
        if(state == "FINISHED")
            return "已完成";
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
    function Refund(order){
        let url = "http://localhost:8080/order/update?id=" + order.id + "&status=" + "CANCELED";
        fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        //退款原因（整合）================================================================================================================
        const refundReason = refundRef.current.value;
        //================================================================================================================
        alert("操作成功！");
        setshowrefund(false);
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
                delta: order.price,
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
                        let url = "http://localhost:8080/order/update?id=" + order.id + "&status=PAID";
                        fetch(url,{method:'PUT'})
                            .then((response) => response.json())
                            .catch((error) => console.error(error));
                        const bal = parseFloat(localStorage.getItem('balance'));
                        localStorage.setItem('balance',(bal-order.money).toString());
                        alert("支付成功！");
                        setpay(false);
                        Return();
                        refreshPage();
                    }else{
                        alert("支付失败：余额不足或账户密码错误！");
                        return;
                    }
                })
                .catch(error => console.log('error', error));
        //================================================================================================================
    }
    function Cancel(order){
        //订单表更新
        let url = "http://localhost:8080/order/update?id=" + order.id + "&status=" + "CANCELED";
        fetch(url,{method:'PUT'})
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("取消成功！");
        setcancel(false);
        Return();
        refreshPage();
    }
    function Get(order){
        //订单表更新
        let url = "http://localhost:8080/order/update?id=" + order.id + "&status=" + "FINISHED";
        fetch(url,{method:'PUT'})
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
        let state = order.status;
        if(state == "UNPAID"){
            unpaid = true;
        }else if(state == "PAID"){
            paid = true;
        }else if(state == "CANCELED"){
            canceled = true;
        }else if(state == "FINISHED"){
            finished = true;
        }
        return (
            <div style={columnstyle}>
                 <div style={rowstyle}>
                     <span style={titlestyle}>订单号</span>
                     <span style={contentstyle}>{order.id}</span>
                 </div>
                 <div  style={rowstyle}>
                     <span style={titlestyle}>航班号</span>
                     <span style={contentstyle}>{order.service_id}</span>
                 </div>
                 <div  style={rowstyle}>
                     <span style={titlestyle}>座位号</span>
                     <span style={contentstyle}>{order.seat_id}</span>
                 </div>
                 <div  style={rowstyle}>
                     <span style={titlestyle}>用户id</span>
                     <span style={contentstyle}>{order.customer_id}</span>
                 </div>
                 <div  style={rowstyle}>
                     <span style={titlestyle}>订单状态</span>
                    <span style={contentstyle}>{getStatus(order.status)}</span>
                </div>
                <div  style={rowstyle}>
                     <span style={titlestyle}>出发时间</span>
                    <span style={contentstyle}>{getDTime(order)}</span>
                </div>
                <div  style={rowstyle}>
                     <span style={titlestyle}>降落时间</span>
                    <span style={contentstyle}>{getATime(order)}</span>
                </div>
                <div  style={rowstyle}>
                     <span style={titlestyle}>航班价格</span>
                    <span style={contentstyle}>{order.price}</span>
                </div>
                 <div  style={rowstyle}>
                     <span style={titlestyle}>创建时间</span>
                     <span style={contentstyle}>{moment(order.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                 </div>
                <div style={buttonsstyle}>
                    <button onClick={Return} style={buttonstyle} className="leftbutton">返 回</button>
                    {unpaid ? <button onClick={() => {
                        setpay(true)
                    }} style={buttonstyle} className="middlebutton">立即付款</button> : null}
                    {unpaid ? <button onClick={() => {
                        setcancel(true)
                    }} style={buttonstyle} className="rightbutton">取消订单</button> : null}
                    {paid ? <button onClick={() => {
                        setdone(true)
                    }} style={buttonstyle} className="middlebutton">确认完成</button> : null}
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
                            <div style={{fontSize: '15px', letterSpacing: '1px', width: '90px'}}>订 单 号</div>
                            <div style={{fontSize: '15px', width: '140px', overflow: 'clip'}}>{order.id}</div>
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
                                style={{fontSize: '25px', marginLeft: '10px', fontWeight: 'bold', color: 'red'}}>{order.price}
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
                {done ? <Popup title={"确认完成"} w={"450px"} h={"200px"}>
                    <div>
                        <p>是否确认完成？确认后无法更改</p>
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
                                <div style={{fontSize: '12px', color: 'gray'}}>{length}/200</div>
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
                                <div style={{fontSize: '12px', color: 'gray'}}>{length}/500</div>
                            </div>
                            <textarea onInput={checkLength} id='myTextarea' maxLength="500" style={{
                                width: '320px',
                                height: '120px',
                                whiteSpace: 'pre-wrap',
                                resize: 'none',
                                fontSize: '14px'
                            }}>
                            </textarea>
                        </div>
                        <button onClick={() => {
                            setcomplaint(false)
                        }} style={{left: '40px'}}>取消
                        </button>
                        <button onClick={() => {
                            setcomplaint(false)
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
                    <Displaydeskforbookforflight onState={handleState}>
                        <div className="ordergood">
                            <div style={spanstyle} className="list-title">
                                <span className="num">序号</span>
                                <span className="order_id">订单号</span> 
                                <span className="flight_id">航班号</span>                               
                                <span className="seat_id">座位号</span>
                                <span className="create_time">生成时间</span>
                                <span className="state">订单状态</span>
                                <span className="count">当前共 {orders.length} 条</span>
                            </div>
                            {orders.map((order, i) => (
                                <div style={spanstyle} className="showlist">
                                    <span className="num">{i+1}</span>
                                    <span className="order_id">{order.id}</span>
                                    <span className="flight_id">{order.service_id}</span>
                                    <span className="seat_id">{order.payload}</span>
                                    <span className="create_time">{moment(order.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                                    <span className="state">{getStatus(order.status)}</span>                                    
                                    <div  className="seemore"><span onClick={Gotospecific(i)} className="click">查看详情</span></div>
                                </div>
                            ))}
                        </div>
                    </Displaydeskforbookforflight >
                }/>
                <Route path='/showorder' element={
                    <ShowOrder />
                } />
            </Routes>
        </div>
    );
}

export default Orderflight;