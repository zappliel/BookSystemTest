import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import Footer from '../components/Footer';
import { backendPort } from "../global/global";

function Register() {
    const [cardId, setCardId] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [realName, setRealName] = useState('');
    const [role, setRole] = useState('BUYER');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [paymentPassword, setPaymentPassword] = useState('');
    const [vip, setVip] = useState(false);
    const[Color,setColor] = useState("red");

    const [showModal, setShowModal] = useState(false);
    const [Msg, setMsg] = useState('');
    const handleCancel = () => {
        setShowModal(false);
    };
    const handleCardIdChange = (event) => {
        setCardId(event.target.value);
    };
    const handleEmailAddressChange = (event) => {
        setEmailAddress(event.target.value);
    };
    const handlePhoneNoChange = (event) => {
        setPhoneNo(event.target.value);
    };
    const handleRealNameChange = (event) => {
        setRealName(event.target.value);
    };
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handlePaymentPasswordChange = (event) => {
        setPaymentPassword(event.target.value);
    };
    function validateIDCard(idCard) {
        // 正则表达式匹配规则
        var regExp = /(^\d{17}[\dXx]$)/;

        // 验证身份证号格式是否符合要求
        if (!regExp.test(idCard)) {
            return false;
        }

        // 验证身份证号最后一位校验码是否正确
        var code = idCard.toUpperCase(); // 将身份证号转换为大写
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var checkSum = 0;
        var checkDigit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

        for (var i = 0; i < 17; i++) {
            checkSum += parseInt(code.charAt(i)) * factor[i];
        }

        var lastChar = code.charAt(17);
        var checkCode = checkDigit[checkSum % 11];

        if (lastChar !== checkCode) {
            return false;
        }

        return true;
    }

    function validatePhoneNumber(phoneNumber) {
        // 正则表达式匹配规则
        var regExp = /^1\d{10}$/;

        // 验证手机号格式是否符合要求
        if (!regExp.test(phoneNumber)) {
            return false;
        }

        return true;
    }

    const handleRegister = () => {

        var isIdValid = validateIDCard(cardId);
        if(!isIdValid){
            //alert('身份证号错误');
            setMsg('身份证号错误');
            setShowModal(true);
            setCardId('');
            return ;
        }
        var isPhoneValid = validatePhoneNumber(phoneNo);
        if(!isPhoneValid){
            //alert('手机号错误');
            setMsg('手机号错误');
            setShowModal(true);
            setPhoneNo('');
            return ;
        }

        const data = {
            username: username,
            cardId: cardId,
            realName: realName,
            password: password,
            paymentPassword:paymentPassword,
            phoneNo: phoneNo,
            emailAddress: emailAddress,
            role: role
        };

        //debug
        console.log(username);
        console.log(cardId);
        console.log(realName);
        console.log(password);
        console.log(paymentPassword);
        console.log(phoneNo);
        console.log(emailAddress);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        fetch(`http://${backendPort}/api/v1/public/register-buyer`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    //alert('注册成功');
                    setMsg('注册成功');
                    setColor("green");
                    setShowModal(true);
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
                        <h5><b>提示</b></h5>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 align="center"><font color={Color}>{Msg}</font></h4>
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
                                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>注册界面</h5>
                                <MDBInput wrapperClass='mb-4' label='用户名' id='form1' type='text' value={username} onChange={handleUsernameChange}/>
                                <MDBInput wrapperClass='mb-4' label='身份证号' id='form2' type='text' value={cardId} onChange={handleCardIdChange}/>
                                <MDBInput wrapperClass='mb-4' label='真实姓名' id='form3' type='text' value={realName} onChange={handleRealNameChange}/>
                                <MDBInput wrapperClass='mb-4' label='密码' id='form4' type='password' value={password} onChange={handlePasswordChange}/>
                                <MDBInput wrapperClass='mb-4' label='支付密码' id='form5' type='password' value={paymentPassword} onChange={handlePaymentPasswordChange}/>
                                <MDBInput wrapperClass='mb-4' label='手机号码' id='form6' type='text' value={phoneNo} onChange={handlePhoneNoChange}/>
                                <MDBInput wrapperClass='mb-4' label='邮箱' id='form7' type='email' value={emailAddress} onChange={handleEmailAddressChange}/>


                                <div className='d-flex justify-content-center mb-4'>
                                    {/* <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' /> */}
                                </div>

                                <MDBBtn className='w-100 mb-4' size='md' onClick={handleRegister}>注册</MDBBtn>
                                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="/" style={{ color: '#393f81' }}>已注册？登入</a></p>
                                <div className="text-center">

                                    {/* <p>or sign up with:</p>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='facebook-f' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='twitter' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='google' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='github' size="sm" />
                                </MDBBtn> */}

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

export default Register;
