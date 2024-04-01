
import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarToggler,
    MDBContainer,
    MDBIcon,
    MDBCollapse,
    MDBBadge,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
} from 'mdb-react-ui-kit';
import './Header.css'

export default function CheckHeader({number, orders}) {
    const [showBasic, setShowBasic] = useState(true);
    const handleLogout = () => {
        localStorage.removeItem('Token'); // 移除存储的token
        // 进行其他登出逻辑（例如重定向到登录页等）
    };
    const filteredOrders = orders ? orders.filter(order => order.state === 1 || order.state === 2) : [];
    return (
        <div>
            <header>
                <MDBNavbar expand='lg' light bgColor='white'  className='header' >
                    <MDBContainer fluid>
                        <MDBNavbarToggler
                            onClick={() => setShowBasic(!showBasic)}
                            aria-controls='navbarExample01'
                            aria-expanded='false'
                            aria-label='Toggle navigation'
                        >
                            <MDBIcon fas icon='bars' />
                        </MDBNavbarToggler>
                        <MDBCollapse show={showBasic}>
                            <MDBNavbarNav right className='mb-2 mb-lg-0'>
                                {/* <MDBIcon fas icon="cube fa-3x me-3" style={{ color: '#172368' }} /> */}
                                <MDBNavbarItem className='d-flex align-items-center'>
                                    <MDBDropdown size="sm">
                                        <MDBDropdownToggle tag='a' className='nav-link' caret>
                                            <MDBIcon fas icon='envelope fa-3x me-3' style={{ color: '#172368' }} />
                                            <MDBBadge color='danger' notification pill className='position-absolute top-0 end-0'
                                            style={{ transform: 'translate(-200%, 75%)' }}>
                                                {number}
                                            </MDBBadge>
                                        </MDBDropdownToggle>
                                        <div style={{ position: 'relative' }}>
                                            <MDBDropdownMenu style={{ minWidth: '200px' }}>
                                                {filteredOrders.map(order => (
                                                    <MDBDropdownItem key={order.order_id}>
                                                        {order.state === 1 && (
                                                            <span style={{ color: 'red' }}>异常订单：</span>
                                                        )}
                                                        {order.state === 2 && (
                                                            <span style={{ color: 'yellow' }}>疑误订单：</span>
                                                        )}
                                                        订单号：{order.order_id}<br />
                                                        买家ID：{order.buyer_id}  卖家ID：{order.seller_id}<br />
                                                    </MDBDropdownItem>
                                                    
                                                ))}
                                            </MDBDropdownMenu>
                                        </div>  
                                    </MDBDropdown>
                                </MDBNavbarItem>
                                <MDBNavbarItem active>
                                    <MDBNavbarLink aria-current='page' href='/checkmain'>
                                    <div style={{ marginTop: '6px' }}>主页</div>
                                    </MDBNavbarLink>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <MDBNavbarLink onClick={handleLogout} href='/rLogin'>
                                    <div style={{ marginTop: '6px' }}>登出</div>
                                    </MDBNavbarLink>
                                </MDBNavbarItem>
                            </MDBNavbarNav>
                        </MDBCollapse>
                    </MDBContainer>
                </MDBNavbar>
            </header>

        </div>
    );
}