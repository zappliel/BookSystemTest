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
    MDBCollapse
} from 'mdb-react-ui-kit';
import './Header.css'

export default function LoginHeader() {
    const [showBasic, setShowBasic] = useState(true);
    return (
        <div>
            <header >
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
                                <MDBIcon fas icon="cube fa-3x me-3" style={{ color: '#172368' }} />
                                <MDBNavbarItem>
                                    <MDBNavbarLink aria-current='page' href='/'>返回</MDBNavbarLink>
                                </MDBNavbarItem>
                            </MDBNavbarNav>
                        </MDBCollapse>
                    </MDBContainer>
                </MDBNavbar>
            </header>

        </div>
    );
}