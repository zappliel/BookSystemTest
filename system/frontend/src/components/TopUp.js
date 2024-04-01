import React from 'react';
import { useState } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Modal, Button } from "react-bootstrap";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBTable,
    MDBTableBody,
    MDBTableHead,
    MDBInputGroup,
    MDBCardTitle,
    MDBInput
}
    from 'mdb-react-ui-kit';
import Footer from "./Footer";
import TopUpConfirmation from './TopUpConfirmationn';


function TopUp() {
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        setShowModal(false);
        // do something
    };

    return (
        <div>
            <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
                <Modal show={showModal} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>充值验证</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>请输入验证码</h2>
                        <MDBInput wrapperClass='mb-4' label='验证码' id='form5' type='text' />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>
                            取消
                        </Button>
                        <Button variant="primary" onClick={handleConfirm}>
                            确认
                        </Button>
                    </Modal.Footer>
                </Modal>
                <MDBRow className='text-center'>
                    <MDBCol md='6' className='position-relative'>
                        <MDBRow className='me-4 text-center'>
                            <MDBCard className='my-5 bg-glass'>
                                <MDBCardTitle className='h1'>余额/充值</MDBCardTitle>
                                <MDBCardBody className='p-5'>
                                    <MDBInputGroup className='mb-3' textBefore='¥' textAfter=''>
                                        <input className='form-control' type='text' />
                                        <MDBBtn className='me-4' onClick={handleButtonClick}>充值</MDBBtn>
                                    </MDBInputGroup>
                                    <MDBBtn className='me-4'>20¥</MDBBtn>
                                    <MDBBtn className='me-4'>50¥</MDBBtn>
                                    <MDBBtn className='me-4'>100¥</MDBBtn>
                                    <MDBBtn className='me-4'>200¥</MDBBtn>
                                    <MDBBtn className='me-4'>500¥</MDBBtn>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBRow>
                        <MDBRow className='me-4 text-center'>
                            <MDBCard className='my-5 bg-glass'>
                                <MDBCardTitle className='h1'>月度统计信息</MDBCardTitle>
                                <MDBCardBody className='p-5'>

                                </MDBCardBody>
                            </MDBCard>
                        </MDBRow>
                    </MDBCol>
                    <MDBCol md='6'>
                        <MDBRow className='me-4 text-center'>
                            <MDBCard className='my-5 bg-glass'>
                                <MDBCardTitle className='h1'>交易记录</MDBCardTitle>
                                <MDBCardBody>
                                    <MDBTable align='middle'>
                                        <MDBTableHead>
                                            <tr>
                                                <th scope='col'>事项</th>
                                                <th scope='col'>数额</th>
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            <tr>
                                                <td>
                                                    <p className='fw-bold mb-1'>付款给六贤记</p>
                                                    <p className='text-muted mb-0'>2023-05-19 13:24:28</p>
                                                </td>
                                                <td>
                                                    <p className='fw-normal mb-1'>28.00</p>
                                                </td>
                                            </tr>
                                        </MDBTableBody>
                                    </MDBTable>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBRow>
                        <MDBRow className='me-4 text-center'>
                            <MDBCard className='my-5 bg-glass'>
                                <MDBCardTitle className='h1'>年度统计信息</MDBCardTitle>
                                <MDBCardBody className='p-5'>

                                </MDBCardBody>
                            </MDBCard>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}

export default TopUp;