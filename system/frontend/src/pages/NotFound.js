import React, { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "../components/Header"
import Footer from "../components/Footer"
import { MDBContainer } from 'mdb-react-ui-kit';

export default function NotFound() {
    return (
        <div>
            <MDBContainer className="my-5 text-center">
                <h1>Page not found.</h1>
            </MDBContainer>
            <Footer />
        </div>
    );
}