import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import React, { useState } from 'react';
import { backendPort } from "../global/global";

export default function Header() {
    const [showBasic, setShowBasic] = useState(true);
    const Logout = () => {
        const Token = localStorage.getItem('Token');
        console.log(Token);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${Token}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://${backendPort}/api/v1/public/logout`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    localStorage.setItem('Token', '');
                    localStorage.setItem('avatarUuid', '');
                    localStorage.setItem('balance', '');
                    localStorage.setItem('cardId', '');
                    localStorage.setItem('emailAddress', '');
                    localStorage.setItem('phoneNo', '');
                    localStorage.setItem('realName', '');
                    localStorage.setItem('role', '');
                    localStorage.setItem('status', '');
                    localStorage.setItem('userId', '');
                    localStorage.setItem('username', '');
                    localStorage.setItem('vip', '');
                    window.location.assign("./");
                    /*localStorage.removeItem('Token');
                    localStorage.removeItem('avatarUuid');
                    localStorage.removeItem('cardId');
                    localStorage.removeItem('emailAddress');
                    localStorage.removeItem('phoneNo');
                    localStorage.removeItem('realName');
                    localStorage.removeItem('role');
                    localStorage.removeItem('status');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    localStorage.removeItem('vip');*/
                }else{

                }
            })
            .catch(error => console.log('error', error));
    }
    return (
        <div>
            <header>
                <MDBNavbar expand='lg' light bgColor='white'>
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
                            <MDBNavbarNav right className='mb-2 mb-lg-0' style={{justifyContent:'center'}}>
                                <MDBNavbarItem active>
                                    <MDBNavbarLink aria-current='page' href='/homepage'>
                                        主页
                                    </MDBNavbarLink>
                                </MDBNavbarItem>
                                {/* <MDBNavbarItem>
                                    <MDBNavbarLink href='/shopping'>购物</MDBNavbarLink>
                                </MDBNavbarItem> */}
                                <MDBNavbarItem>
                                    <MDBNavbarLink href='/flightSearchPage'>机票</MDBNavbarLink>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <MDBNavbarLink href='/hotelSearchPage'>酒店</MDBNavbarLink>
                                </MDBNavbarItem>
                                
                                <MDBNavbarItem>
                                    <MDBNavbarLink style={{width:'100px'}}href='/reference'>个人中心</MDBNavbarLink>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <MDBNavbarLink  onClick={Logout}>登出</MDBNavbarLink>
                                </MDBNavbarItem>
                            </MDBNavbarNav>
                        </MDBCollapse>
                    </MDBContainer>
                </MDBNavbar>
            </header>

        </div>
    );
}