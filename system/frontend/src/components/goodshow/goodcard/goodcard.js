import React from "react";
import './goodcard.css';


function Goodcard(props)
{
    const {name,price,imgsrc,description,id,stock} = props;
    function HandleClick()
    {
        props.onSignal();
        props.onProps(props);
    }
    return(
        <div className="goodcard">
            <img style={{width:'130px',objectFit:'cover'}} src={ process.env.PUBLIC_URL + "images/" + imgsrc} alt='error'/>
            <div className="rightpart">
                <div style={{textAlign:'center',fontSize:'15px',width:'80%',height:'30px',marginTop:'8%',marginBottom:'8%',whiteSpace:'nowrap',overflow:'clip'}}>{name}</div>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'75%',height:'50%',marginLeft:'10%'}}>
                    <img src={process.env.PUBLIC_URL + '/images/money.svg'} alt='error' className="money"/>
                    <p style={{fontSize:'40px',marginLeft:'10px',textAlign:'center',width:'40px'}}>{price}</p>
                </div>
                <button onClick={HandleClick} >立即购买</button>
            </div>
            <div className="description">{description}</div>
        </div>
    );
}

export default Goodcard;