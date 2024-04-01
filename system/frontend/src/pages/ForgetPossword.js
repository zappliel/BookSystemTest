import React, {useState} from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon
}
    from 'mdb-react-ui-kit';
import Footer from '../components/Footer';
import {backendPort} from "../global/global";
import {Button, Modal} from "react-bootstrap";
function Forget() {
    const [username, setUsername] = useState('');
    const [newLoginPassword, setNewLoginPassword] = useState('');
    const [verificationCode, setVerification] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [Msg, setMsg] = useState('');

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setNewLoginPassword(event.target.value);
    };
    const handleVerificationCodeChange = (event) => {
        setVerification(event.target.value);
    };

    const handleRegister = () => {

        const data = {
            username: username,
            newLoginPassword: newLoginPassword,
            verificationCode: verificationCode
        };

        //debug
        console.log(username);
        console.log(newLoginPassword);
        console.log(verificationCode);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        fetch(`http://${backendPort}/api/v1/public/forget-password`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    //alert('修改成功');
                    setMsg('修改成功');
                    setShowModal(true)
                }else{
                    //alert(result.message);
                    setMsg(result.message);
                    setShowModal(true);
                }
            })
            .catch(error => console.log('error', error));
    };
    return (
        <div>
            <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
                <Modal show={showModal} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <h5><b>修改</b></h5>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 align="center"><font color="red">{Msg}</font></h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>
                            确认
                        </Button>
                    </Modal.Footer>
                </Modal>
                <MDBRow>
                    <MDBCol md='3'></MDBCol>
                    <MDBCol md='6' className='position-relative'>

                        <MDBCard className='my-5 bg-glass'>
                            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                            <MDBCardBody className='p-5'>
                                <div className='d-flex flex-row mt-2'>
                                    <MDBIcon fas icon="cube fa-3x me-3" style={{ color: '#172368' }} />
                                    <span className="h1 fw-bold mb-0">在线支付系统</span>
                                </div>
                                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>修改密码</h5>
                                <MDBInput wrapperClass='mb-4' label='用户名' id='form1' type='text' value={username} onChange={handleUsernameChange}/>
                                <MDBInput wrapperClass='mb-4' label='新的密码' id='form2' type='password' value={newLoginPassword} onChange={handlePasswordChange}/>
                                <MDBInput wrapperClass='mb-4' label='验证码' id='form3' type='text' value={verificationCode} onChange={handleVerificationCodeChange}/>

                                <div className='d-flex justify-content-center mb-4'>
                                    {/* <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' /> */}
                                </div>

                                <MDBBtn className='w-100 mb-4' size='md' onClick={handleRegister}>确认修改</MDBBtn>
                                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="/" style={{ color: '#393f81' }}>已修改？登入</a></p>
                                <div className="text-center">
                                </div>

                            </MDBCardBody>
                        </MDBCard>

                    </MDBCol>

                </MDBRow>
            </MDBContainer>
            <Footer />
        </div>
    );
}

export default Forget;