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
import { backendPort } from "../global/global";

function Login() {
    /*const handleToken = () => {
        console.log(window.Token);
    }*/
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [Msg, setMsg] = useState('');
//开始


    const GetUserInfo = () => {
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
        fetch(`http://${backendPort}/api/v1/user/get-info`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                if(result.statusCode = 'SUCCESS'){
                    localStorage.setItem('avatarUuid', result.data.avatarUuid);
                    localStorage.setItem('balance', result.data.balance);
                    localStorage.setItem('cardId', result.data.cardId);
                    localStorage.setItem('emailAddress', result.data.emailAddress);
                    localStorage.setItem('phoneNo', result.data.phoneNo);
                    localStorage.setItem('realName', result.data.realName);
                    localStorage.setItem('role', result.data.role);
                    localStorage.setItem('status', result.data.status);
                    localStorage.setItem('userId', result.data.userId);
                    localStorage.setItem('username', result.data.username);
                    localStorage.setItem('vip', result.data.vip);
                    
                    
                    //debug
                    for(let  i = 0; i < localStorage.length; i++){
                        const key = localStorage.key(i);
                        const value = localStorage.getItem(key);
                        console.log(`${key} : ${value}`);
                    }
                }else{
                    alert(result.message())
                }
            })
            .catch(error => console.log('error', error));
    }
    //结束
    const handleCancel = () => {
        setShowModal(false);
    };
    const handleButtonClick = () => {
        setShowModal(true);
    };
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleLogin = () => {
        //debug
        console.log('Username:', username);
        console.log('Password:', password);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://${backendPort}/api/v1/public/login`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    localStorage.setItem('Token', result.data.token);
                    const Token = localStorage.getItem('Token');
                    console.log(Token);
                    
                            GetUserInfo();
                    switch(localStorage.getItem('role')){
                        case "SELLER": window.location.assign("./sreference"); break;// 在当前窗口中打开指定的 URL
                        case "BUYER": window.location.assign("./homepage"); break;// 在当前窗口中打开指定的 URL
                        case "ADMIN":window.location.assign("./backreference");break;// 在当前窗口中打开指定的 URL
                    }
                    
                }else {
                    //alert(result.message);
                    //加入弹窗
                    console.log(result);
                    setMsg(result.message);
                    setShowModal(true);

                }
            })
            .catch(error => console.log('error', error));
    };

    return (
        <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
            <MDBContainer style={{display:'flex',justifyContent:'center',margin:'0px'}}className="my-5">
                <Modal show={showModal} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <h5><b>登录失败</b></h5>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 align="center"><span style={{ marginRight: '8px' ,color: 'red'}}>&#9888;</span><font color="red">{Msg}</font></h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>
                            确认
                        </Button>
                    </Modal.Footer>
                </Modal>

                <MDBRow className='text-center'>
                    {/*<MDBCol md='3'></MDBCol>*/}
                    <MDBCol md='6' className='position-relative'>
                        <MDBCard style={{display:'flex',justifyContent:'center',width:'600px'}}>
                            <MDBCardBody className='d-flex flex-column'>

                                <div className='d-flex flex-row mt-2'>
                                    <MDBIcon fas icon="cube fa-3x me-3" style={{ color: '#172368' }} />
                                    <span className="h1 fw-bold mb-0">在线支付系统</span>
                                </div>

                                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>登入界面</h5>

                                <MDBInput wrapperClass='mb-4' label='用户名' id='form1' type='text' size="lg" value={username} onChange={handleUsernameChange} />
                                <MDBInput wrapperClass='mb-4' label='密码' id='form2' type='password' size="lg" value={password} onChange={handlePasswordChange} />

                                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>登入</MDBBtn>
                                <a className="small text-muted" href="/forget">忘记密码?</a>
                                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="/register" style={{ color: '#393f81' }}>没有账户？这里注册！</a></p>

                            </MDBCardBody>
                            {/* <MDBRow> */}
                                {/* <MDBCol>
                                    <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="/rLogin" style={{ color: '#393f81' }}>审核员登录</a></p>
                                </MDBCol> */}
                                {/*<MDBCol>*/}
                                {/*    /!*<p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="/" style={{ color: '#393f81' }}>卖家</a></p>*!/*/}
                                {/*</MDBCol>*/}
                                {/* <MDBCol>
                                    <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="/#" style={{ color: '#393f81' }}>在线预定登录</a></p>
                                </MDBCol> */}
                                 {/* <MDBCol>
                                    <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}><a href="http://10.196.72.20:3000/" style={{ color: '#393f81' }}>管理员登录</a></p>
                                </MDBCol> */}
                                {/* <MDBCol>
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                    <label className="form-check-label" htmlFor="flexCheckDefault">卖家</label>
                                </MDBCol> */}
                            {/* </MDBRow> */}


                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            {/*<Footer />*/}
        </div>
    );
}

export default Login;