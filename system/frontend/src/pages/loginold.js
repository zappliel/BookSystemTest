import React, {useState} from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput,
    MDBModal
}
    from 'mdb-react-ui-kit';
import Footer from '../components/Footer';
import LoginAlert from "../components/LoginAlert";
import ReactDOM from "react-dom/client";
import {Button, Modal} from "react-bootstrap";
import {Cookie} from "../global/Global"
import {backenPort} from "../global/Global";

function Login() {
    /*const handleToken = () => {
        console.log(window.Token);
    }*/
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

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

        fetch(`http://${backenPort}/api/v1/public/login`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    localStorage.setItem('Token', result.data);
                    const Token = localStorage.getItem('Token');
                    console.log(Token);
                    window.location.assign("./updateUserInformationPage"); // 在当前窗口中打开指定的 URL
                }else {
                    //alert(result.message);
                    //加入弹窗
                    setShowModal(true);

                }
            })
            .catch(error => console.log('error', error));
    };

    return (
        <div>
            <MDBContainer className="my-5">

                <Modal show={showModal} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title >登陆失败</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 align="center">您输入的账户或密码有误</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancel}>
                            确认
                        </Button>
                    </Modal.Footer>
                </Modal>

                <MDBRow className='text-center'>
                    <MDBCol md='3'></MDBCol>
                    <MDBCol md='6' className='position-relative'>
                        <MDBCard>
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
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            <Footer />
        </div>
    );
}

export default Login;