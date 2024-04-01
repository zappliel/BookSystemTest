import queryString from 'query-string';
import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Searchbox from "../../components/displaydesk/searchbox/searchbox";
import Popup from "../../components/popup/popup";
import Snavigator from "../../components/snavigator/snavigator";
import './sgood.css';

function Sgood()
{
    const curId = localStorage.getItem('userId');//=========================================
    const navigate = useNavigate();
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const locate_searchbox={
        top:`${pageHeight * 0.05}px`,
        left:`${pageWidth * 0.22}px`
    }
    const spanstyle = {
        height:`${pageHeight * 0.05}px`
    }
    const[showaddgood,setshowaddgood] = useState(false);
    const[showmodifygood,setshowmodifygood] = useState(false);

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
        height:'9%',
        borderBottom:'1px solid rgba(0,0,0,0.1)'
    };
    const imgstyle = {
        display:'flex',
        flexDirection:'row',
        fontSize:'15px',
        height:'23%',
        alignItems:'center',
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
    const textareastyle = {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        fontSize:'15px',
        height:'25%',
        borderBottom:'1px solid rgba(0,0,0,0.1)'
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
    const refreshPage = () => {
        window.location.reload();
    }
    function handleclick()
    {
        setshowaddgood(true);
    }
    function CloseAddgood()
    {
        setshowaddgood(false);
    }
    function CloseModifygood()
    {
        setshowmodifygood(false);
    }
    function Return(){
        return navigate('/sgood');
    }
    function deletegood(id){  //待填写数据库操作
        fetch(`http://localhost:8080/item/delete?id=${id}`)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        alert("删除成功!");
        state = -state;
        Return();
        refreshPage();
    }

    function modifygood(){
        setshowmodifygood(true);
    }

    function Addgood()
    {
        const labelstyle={
            fontSize:'15px',
            width:'90px',
            letterSpacing:'2px'
        }
        const inputstyle={
            width:'200px',
            height:'20px'
        }
        const defaultstyle={
            height:'120px',
            width:'98%',
            border:'1px solid gray',
            borderRadius:'4px',
            transition:'all.5s',
            objectFit:'cover',
            fontSize:'15px',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            color:'gray',
            fontWeight:'bold'
        }
        const imagestyle={
            height:'98%',
            width:'98%',
            border:'1px solid gray',
            borderRadius:'4px',
            transition:'all.5s',
            objectFit:'cover'
        }
        const[length,setlength] = useState(0);
        const [previewUrl, setPreviewUrl] = useState(null);
        const nameRef = useRef(null);
        const priceRef = useRef(null);
        const stockRef = useRef(null);
        const desRef = useRef(null);
        const [img, setimg] = useState("");
        function handleinput()
        {
            const name = nameRef.current.value;
            const price = priceRef.current.value;
            const stock = stockRef.current.value;
            const des = desRef.current.value;
            let params = new URLSearchParams();
            params.set('name',name);
            params.set('price',price);
            params.set('stock',stock);
            params.set('description',des);
            params.set('seller',curId.toString());//==============================================seller的id需要获取=====================
            params.set('img',img);
            let url = `http://localhost:8080/item/insert?${params.toString()}`
            fetch(url)
                .then((response) => response.json())
                .catch((error) => console.error(error));
            alert("添加成功！");
            CloseAddgood();
            state = -state;//更新状态，重新扫描
            refreshPage();
        }

        function checkLength() {
            var currentLength = document.getElementById("myTextarea").value.length;
            setlength(currentLength);
          }

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setimg(file.name);
        };
        return(
            <Popup title={"添加货品"} w={'600px'} h={'400px'}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'start',justifyContent:'space-between',height:'85%',width:'90%',marginLeft:'5%',marginRight:'5%'}}>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'start',width:'100%',height:'53%'}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',width:'65%',height:'100%'}}>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}>
                                <div style={labelstyle}>商品名</div>
                                <input style={inputstyle} ref={nameRef}/>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}>
                                <div style={labelstyle} >商品单价</div>
                                <input style={inputstyle} ref={priceRef}/>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}> 
                                <div style={labelstyle} >商品库存</div>
                                <input style={inputstyle} ref={stockRef}/>
                            </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'35%',height:'100%'}}>
                            <div style={{width:'10%',height:'100%',lineHeight:'22px',marginLeft:'3%',fontSize:'15px'}}>
                                商品图片
                            </div>
                            <div style={{height:'100%',width:'80%',marginLeft:'7%'}}>
                                <label title="上传图片" className="loadlabel" for="file_input">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" style={imagestyle} />
                                    ) : (
                                        <div style={defaultstyle}>
                                            <img src="../../../images/plus.svg" alt="error" style={{width:'20%'}}/>
                                            上传图片
                                        </div>
                                    )}
                                </label>
                                <input onChange={handleImageUpload} type="file" accept=".png,.jpg,.jpeg" id="file_input" name="file_input" style={{display:'none'}}/>
                            </div>
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'start',width:'100%'}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <div style={labelstyle}>商品描述</div>
                            <div style={{fontSize:'12px',color:'gray'}}>{length}/200</div>
                        </div>
                        <textarea onInput={checkLength} id='myTextarea' maxlength="200" style={{width:'390px',height:'80px',whiteSpace:'pre-wrap',resize:'none',fontSize:'14px'}} ref={desRef}>
                        </textarea>
                    </div>
                </div>
                <div>
                    <button onClick={CloseAddgood} style={{left:'40px'}}>取消</button>
                    <button onClick={handleinput} style={{right:'40px'}}>确认</button>
                </div>
            </Popup>
        );
    }
    //可实现只修改部分值
    function Modifygood(props)
    {
        const {id,name,price,stock,desc,imgsrc}=props;
        const labelstyle={
            fontSize:'15px',
            width:'90px',
            letterSpacing:'2px'
        }
        const inputstyle={
            width:'200px',
            height:'20px'
        }
        const defaultstyle={
            height:'98%',
            width:'98%',
            border:'1px solid gray',
            borderRadius:'4px',
            transition:'all.5s',
            objectFit:'cover',
            fontSize:'15px',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            color:'gray',
            fontWeight:'bold'
        }
        const imagestyle={
            height:'98%',
            width:'98%',
            border:'1px solid gray',
            borderRadius:'4px',
            transition:'all.5s',
            objectFit:'cover'
        }
        const[length,setlength] = useState(0);
        const [previewUrl, setPreviewUrl] = useState(null);
        const nameRef = useRef(null);
        const priceRef = useRef(null);
        const stockRef = useRef(null);
        const desRef = useRef(null);
        let img = "";
        function handleinput()
        {
            const name = nameRef.current.value;
            const price = priceRef.current.value;
            const stock = stockRef.current.value;
            const des = desRef.current.value;
            let params = new URLSearchParams();
            params.set('id',id);
            if(name != "")
                params.set('name',name);
            if(price != "")
                params.set('price',price);
            if(stock != "")
                params.set('stock',stock);
            if(des != "")
                params.set('description',des);
            params.set('seller',curId.toString());//==============================================seller的id需要获取=====================
            if(img != "")
                params.set('img',img);
            let url = `http://localhost:8080/item/update?${params.toString()}`
            fetch(url)
                .then((response) => response.json())
                .catch((error) => console.error(error));
            alert("修改成功！");
            CloseModifygood();
            state = -state;//更新状态，重新扫描
            Return();//退回到上一页
            refreshPage();
        }

        function checkLength() {
            var currentLength = document.getElementById("myTextarea").value.length;
            setlength(currentLength);
        }

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            img = file.name;
        };
        return(
            <Popup title={"修改货品"} w={'600px'} h={'400px'}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'start',justifyContent:'space-between',height:'85%',width:'90%',marginLeft:'5%',marginRight:'5%'}}>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'start',width:'100%',height:'53%'}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',width:'65%',height:'100%'}}>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}>
                                <div style={labelstyle}>商品名</div>
                                <input style={inputstyle} defaultValue={name} ref={nameRef}/>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}>
                                <div style={labelstyle}>商品单价</div>
                                <input style={inputstyle} defaultValue={price} ref={priceRef}/>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}>
                                <div style={labelstyle}>商品库存</div>
                                <input style={inputstyle} defaultValue={stock} ref={stockRef}/>
                            </div>
                        </div>
                        <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'35%',height:'100%'}}>
                            <div style={{width:'10%',height:'100%',lineHeight:'22px',marginLeft:'3%',fontSize:'15px'}}>
                                商品图片
                            </div>
                            <div style={{height:'100%',width:'80%',marginLeft:'7%'}}>
                                <label title="上传图片" className="loadlabel" for="file_input">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" style={imagestyle} />
                                    ) : (
                                        <img src={imgsrc} alt="Preview" style={imagestyle}/>
                                    )}
                                </label>
                                <input onChange={handleImageUpload} type="file" accept=".png,.jpg,.jpeg" id="file_input" name="file_input" style={{display:'none'}}/>
                            </div>
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'start',width:'100%'}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <div style={labelstyle}>商品描述</div>
                            <div style={{fontSize:'12px',color:'gray'}}>{length}/200</div>
                        </div>
                        <textarea onInput={checkLength} id='myTextarea' maxlength="200" defaultValue={desc} style={{width:'390px',height:'80px',whiteSpace:'pre-wrap',resize:'none',fontSize:'14px'}} ref={desRef}>
                        </textarea>
                    </div>
                </div>
                <div>
                    <button onClick={CloseModifygood} style={{left:'40px'}}>取消</button>
                    <button onClick={handleinput} style={{right:'40px'}}>确认</button>
                </div>
            </Popup>
        );
    }
    const [items, setItems] = useState([]);
    const [message,setMessage] = useState("");
    let [state,setstate] = useState(1);
    useEffect(() => {
            if(message != ""){
                fetch(`http://localhost:8080/item/findName?name=${message}&seller=${curId}`)
                    .then((response) => response.json())
                    .then((items) => setItems(items))
                    .catch((error) => console.error(error));
            }else{
                fetch(`http://localhost:8080/item/find?seller=${curId}`)
                    .then((response) => response.json())
                    .then((items) => setItems(items))
                    .catch((error) => console.error(error));
            }
    }, [message,state]);
    const handleMessage = (msg) => {
        setMessage(msg);
    };
    function Gotogood(index)
    {
        return function(){
            navigate('./showgood'+ "?index=" + index.toString());
        };
    }
    function Showgood(){
        const location = useLocation();
        const params = queryString.parse(location.search);
        const index = params.index;
        const item = items[index];
        const imgsrc = "../../../images/" + item.img;
        return (
            <div style={columnstyle}>
                <div  style={rowstyle}>
                    <span style={titlestyle}>商品名</span>
                    <span style={contentstyle}>{item.name}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>商品单价</span>
                    <span style={contentstyle}>{item.price}</span>
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>剩余库存</span>
                    <span style={contentstyle}>{item.stock}</span>
                </div>
                <div  style={imgstyle}>
                    <span style={titlestyle}>商品图片</span>
                    <img style={{height:'70%'}} src={imgsrc} alt="error" />
                </div>
                <div  style={rowstyle}>
                    <span style={titlestyle}>已售数量</span>
                    <span style={contentstyle}>{item.sold}</span>
                </div>
                <div  style={textareastyle}>
                    <span style={titlestyle}>商品描述</span>
                    <textarea style={{resize:'none',width:'80%',height:'80%',border:'none'}} readOnly={true} value={item.description}></textarea>
                </div>
                <div style={buttonsstyle}>
                    <button onClick={Return} style={buttonstyle} className="leftbutton">返 回</button>
                    <button onClick={() => deletegood(item.productId)} style={buttonstyle} className="middlebutton">下架货品</button>
                    <button onClick={modifygood} style={buttonstyle} className="rightbutton">修改货品</button>
                </div>
                {showmodifygood &&
                    // <Modifygood id={item.productId}/>
                    <Modifygood id={item.productId} name={item.name} price={item.price} stock={item.stock} imgsrc={"../../../images/" + item.img} desc={item.description}/>
                }
            </div>
        );
    }
    return(
        <div>
            <Routes>
                <Route path='/' element={
                    <div style={{top:'0',left:'0',height:`${pageHeight}px`,width:`${pageWidth}px`}} className="deskboard">
                        <Searchbox tipnote="请输入货品名" locate={locate_searchbox} width={`${pageWidth*0.6}px`} onMessage={handleMessage}/>
                        <button onClick={handleclick} className="addbutton" style={{top:`${pageHeight * 0.05}px`,right:`${pageWidth * 0.05}px`}}>添加货品</button>
                        <div className="good">
                            <div style={spanstyle} className="list-title">
                                <span className="num">序号</span>
                                <span className="name">商品名</span>
                                <span className="price">商品单价</span>
                                <span className="stock">剩余库存</span>
                                <span className="count">当前共{items.length}条</span>
                            </div>
                            {items.map((item, i) => (
                                <div style={spanstyle} className="showlist">
                                    <span className="num">{i+1}</span>
                                    <span className="name">{item.name}</span>
                                    <span className="price">{item.price}</span>
                                    <span className="stock">{item.stock}</span>
                                    <div className="seemore"><span onClick={Gotogood(i)} className="click">查看详情</span></div>
                                </div>
                            ))}
                        </div>
                        {showaddgood &&
                            <Addgood/>
                        }
                    </div>
                }/>
                <Route path="/showgood" element={<Showgood />} />
            </Routes>
            <Snavigator/>
        </div>
    );

}

export default Sgood;