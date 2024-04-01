
import React, { useEffect, useRef, useState } from "react";
import Searchbox from "../displaydesk/searchbox/searchbox";
import Popup from "../popup/popup";
import Pricefilter from "../pricefilter/pricefilter";
import Goodcard from "./goodcard/goodcard";
import './goodshow.css';

function Goodshow(props)
{
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const[showpurchase,setshowpurchase] = useState(false);
    const[name,setname] = useState("");
    const[price,setprice] = useState(0);
    const[id,setid] = useState(0);
    const[stock,setstock] = useState(0);
    const {locate,size}  = props;

    const [items, setItems] = useState([]);
    const [showOrder, setOrder] = useState(0);
    const [message, setMessage] = useState("");


    const handleOrder = (showOrder) => {
        setOrder(showOrder);
    };
    const handleMessage = (msg) => {
        setMessage(msg);
    };
    function compareByPrice1(a, b) {
        if (a.price < b.price) {
            return -1;
        }
        if (a.price > b.price) {
            return 1;
        }
        return 0;
    }
    function compareByPrice2(a, b) {
        if (a.price > b.price) {
            return -1;
        }
        if (a.price < b.price) {
            return 1;
        }
        return 0;
    }
    useEffect(() => {
        if(showOrder == 0){
            if(message != ""){
                fetch(`http://localhost:8080/item/findName?name=${message}`)
                    .then((response) => response.json())
                    .then((items) => setItems(items))
                    .catch((error) => console.error(error));
            }else{
                fetch("http://localhost:8080/item/find")
                    .then((response) => response.json())
                    .then((items) => setItems(items))
                    .catch((error) => console.error(error));
            }
        }
    }, [message,showOrder]);


    useEffect(() => {
        if(showOrder == 1){
            items.sort(compareByPrice2);
            handleOrder(3);
        }else if(showOrder == 2){
            items.sort(compareByPrice1);
            handleOrder(3);
        }
    }, [showOrder]);

    const handleChildSignal = () => {
        setshowpurchase(true);
    };

    const handleChildProps = (props) => {
        const {name,price,id,stock} =props;
        setname(name);
        setprice(price);
        setid(id);
        setstock(stock);
    }
    const locate_searchbox={
        top: `${pageHeight*0.11}px`,
        left: `${pageWidth*0.03}px`
    }
    const locate_pricefilter={
        top:`${pageHeight*0.11}px`,
        left:`${pageWidth*0.85}px`
    }
    function ClosePurchase()
    {
        setshowpurchase(false);
    }

    function PopupContent(props) {
        const backendPort = '10.188.39.155:8080';
        const [count, setCount] = useState(1);
        //const inputRef = useRef(null);
        const passwordRef = useRef(null);
        let buyer = localStorage.getItem('userId');
        let password = "";
        let paystate=0;
        const handleMonth = () => {
        
            const Token = localStorage.getItem('Token');
            console.log(Token);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
            const data = {
                delta: count*price,
                paymentPassword: passwordRef.current.value
            }
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
                body: JSON.stringify(data)
            };
            console.log(data);
            fetch(`http://${backendPort}/api/v1/user/transfer`, requestOptions)
                .then(reponse => reponse.json())
                .then(result => {
                    console.log(result);
                    if(result.statusCode == 'SUCCESS'){
                        paystate=1;
                    }else{
                    }
                })
                .catch(error => console.log('error', error));
         
        }
        function handleinput()
        {
            password = passwordRef.current.value;
        }
        const handleIncrease = () => {
            if(count<99)
            {
                setCount((prevCount) => prevCount + 1);
            }
        };
        const handleDecrease = () => {
            if(count>1)
            {
                setCount((prevCount) => prevCount - 1);
            }
        }
        //插入订单记录
        //=======================================================================================================
        function handleInsert(state){
            if(stock < count){
                alert("库存不足！");
                return;
            }
            handleinput();
            if(state == 1){
                handleUpdate();
                alert("待支付！");
                let params = new URLSearchParams();
                        params.set('id',id);
                        params.set('buyerId',buyer);
                        params.set('num',count);
                        params.set('state',state);
                        params.set('money',(count*price).toString());
                        let url = `http://localhost:8080/order/insert?${params.toString()}`
                        fetch(url)
                            .then((response) => response.json())
                            .catch((error) => console.error(error));
                return;
            }
            const Token = localStorage.getItem('Token');
            console.log(Token);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
            const data = {
                delta: count*price,
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
                        let params = new URLSearchParams();
                        params.set('id',id);
                        params.set('buyerId',buyer);
                        params.set('num',count);
                        params.set('state',state);
                        params.set('money',(count*price).toString());
                        let url = `http://localhost:8080/order/insert?${params.toString()}`
                        fetch(url)
                            .then((response) => response.json())
                            .catch((error) => console.error(error));
                        const bal = parseFloat(localStorage.getItem('balance'));
                        localStorage.setItem('balance',(bal-count*price).toString());
                        handleUpdate();
                        alert("购买成功！");
                    }else{
                        alert("购买失败：余额不足或账户密码错误！");
                        return;
                    }
                })
                .catch(error => console.log('error', error));
        }
        //更新库存
        function handleUpdate(){
            let params = new URLSearchParams();
            params.set('id',id);
            params.set('stock',(-count).toString());
            let url = `http://localhost:8080/item/update?${params.toString()}`
            fetch(url)
                .then((response) => response.json())
                .catch((error) => console.error(error));
            ClosePurchase();
        }
        return (
            <Popup title={"付 款 中"}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'start',justifyContent:'space-between',height:'85%',width:'90%',marginLeft:'5%',marginRight:'5%'}}>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontSize:'15px',letterSpacing:'1px',width:'90px'}}>商 品 名</div>
                        <div style={{fontSize:'15px',width:'140px',overflow:'clip'}}>{name}</div>
                        <div style={{marginLeft:'10px',fontSize:'15px',letterSpacing:'1px',width:'90px'}}>数 量</div>
                        <img onClick={handleDecrease} src={ process.env.PUBLIC_URL + 'images/minus.svg'} alt='error' className="countbutton" style={{height:'10px'}}/>
                        <div style={{marginLeft:'15px',fontSize:'20px',fontWeight:'bold',color:'red'}}>{count}</div>
                        <img onClick={handleIncrease} src={ process.env.PUBLIC_URL + 'images/plus.svg'} alt='error' className="countbutton" style={{marginLeft:'15px',height:'10px'}}/>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontSize:'15px',letterSpacing:'1px',width:'90px'}}>总 金 额</div>
                        <img src={ process.env.PUBLIC_URL + 'images/money.svg'} alt='error' style={{height:'15px'}} />
                        <div style={{fontSize:'25px',marginLeft:'10px',fontWeight:'bold',color:'red'}}>{(price*count).toFixed(2)}</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <div style={{fontSize:'15px',letterSpacing:'1px',width:'90px'}}>账 户 ID</div>
                        <input style={{width:'300px',height:'20px'}}/>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <div style={{fontSize:'15px',letterSpacing:'1px',width:'90px'}}> 密 码</div>
                        <input type={"password"} style={{width:'300px',height:'20px'}} ref={passwordRef}/>
                    </div>
                </div>
                <div>
                    <button onClick={ClosePurchase} style={{left:'40px'}}>取消支付</button>
                    <button onClick={() => handleInsert(1)} style={{left:'195px'}}>稍后支付</button>
                    <button onClick={() => handleInsert(2)} style={{right:'40px'}}>确认支付</button>
                </div>
            </Popup>
        );
    }
    return(
        <div>
            <div style={{...locate,...size}} className="board">
                {items.map((item, i) => (
                    <Goodcard
                        key={i}
                        onSignal={handleChildSignal}
                        onProps={handleChildProps}
                        imgsrc={item.img}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        id={item.productId}
                        stock={item.stock}
                    />
                ))}
            </div>
            <Searchbox tipnote='请输入商品名' locate={locate_searchbox} width={`${pageWidth*0.8}px`} onMessage={handleMessage}/>
            <Pricefilter locate={locate_pricefilter} onOrder={handleOrder}/>
            {showpurchase&&
                <PopupContent />
            }
        </div>
    );
}

export default Goodshow;