import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../components/Header';
import MainNav from '../../components/mainnav/mainnav';
import './homepage.css';

const Homepage = () =>{
    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;

    const navTop = `${pageHeight * 0.25}px`;
    const width = `${pageWidth * 0.4}px`;
    const height = `${pageHeight * 0.6}px`;

    const navStyle = {
        position:'relative',
        top: navTop,
        width: width,
        height:height,
    };
    for(let  i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key} : ${value}`);
    
    }

    return(
        <div style={{width:`${pageWidth}px`}}>
            <div className='background'></div> 
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                {/* <NavLink to='/shopping' style={navStyle} className="my-link left">
                    <MainNav title={"商品选购"} image={'images/shopping.svg'} subtitle={'Shopping'}/>
                </NavLink> */}
                <NavLink to='/flightSearchPage' style={navStyle} className="my-link left">
                    <MainNav title={"机票预订"} image={'images/plane.svg'} subtitle={'Ticket'}/>
                </NavLink>
                <NavLink to='/hotelSearchPage' style={navStyle} className="my-link right">
                    <MainNav title={"酒店预订"} image={'images/hotel.svg'} subtitle={'Hotel'}/>
                </NavLink>
            </div>
            <div style={{position:'absolute',top:'0px',width:'100%'}}>
                <Header style={{top:'0px',width:'100%'}}/>
            </div>
            {/* <Header1 username='Li Hua'/> */}
            
            
        </div>
    );
}

export default Homepage;