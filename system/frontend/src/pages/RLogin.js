import React,{useState} from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios';
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
    MDBInputGroup
}
    from 'mdb-react-ui-kit';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import Header from '../components/Header';
import LoginHeader from '../components/recon/LoginHeader';
import { Modal } from 'react-bootstrap';
import { backendPort } from '../global/global';

function RLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [basicModal, setBasicModal] = useState(false);
    const navigate = useNavigate(); // 获取导航函数的实例
    const handleCancel = () => {
        setBasicModal(false);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleLogin = () => {
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
                    navigate('/checkmain'); // 使用导航函数进行页面跳转
                }else {

                    console.log(result);
                    setBasicModal(true);
                    //alert("登陆失败")

                }
            })
            .catch(error => console.log('error', error));

        // axios.post(`http://${backendPort}/api/v1/public/login`, null, {
        //     params: {
        //         username: username,
        //         password: password
        //     }
        // })
        //     .then(result =>{
        //         // 在这里处理从后端获取到的数据
        //         const token = result.data.token;
        //         console.log('Token:', token);
        //         console.log(result)
        //         const data = result;
        //         const message = result.data.message;
        //         console.log(message);
        //         if(message==="登录成功"){
        //             localStorage.setItem('Token', token);
        //             const Token = localStorage.getItem('Token');
        //             console.log(Token);
        //             navigate('/checkmain'); // 使用导航函数进行页面跳转
        //         }else{
        //             // console.log(data);
        //             setBasicModal(true);
        //             //alert("登陆失败")
        //         }
        //     })
        //     .catch(error => {
        //         // 处理请求错误
        //         console.error(error);
        //     });
    };

    return (
        <div style={{display:'flex',alignContent:'center',justifyContent:'center'}}>
            <LoginHeader />
            <MDBContainer style={{display:'flex',justifyContent:'center',margin:'0px',top:'100px'}} className="my-5">
                <Modal show={basicModal} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontSize: '16px' }}>登录失败</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ fontSize: '10px' }}>
                        <h4 align="center" >
                            <span style={{ marginRight: '8px' ,color: 'red'}}>&#9888;</span>您输入的账户或密码有误
                        </h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <MDBBtn variant="secondary" onClick={handleCancel}>
                            确认
                        </MDBBtn>
                    </Modal.Footer>
                </Modal>


                <MDBRow className='text-center'>
                    <MDBCol md='6' className='position-relative'>
                        <MDBCard style={{display:'flex',justifyContent:'center',width:'600px'}}>
                            <MDBCardBody className='d-flex flex-column'>

                                <div className='d-flex flex-row mt-2'>
                                    <MDBIcon fas icon="cube fa-3x me-3" style={{ color: '#172368' }} />
                                    <span className="h2 fw-bold mb-0">审核员对账系统</span>
                                </div>

                                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>审核员登入界面</h5>

                                <MDBInput wrapperClass='mb-4' label='用户名' id='formControlLg' type='email' size="lg" value={username} onChange={handleUsernameChange}/>
                                <MDBInput wrapperClass='mb-4' label='密码' id='formControlLg' type='password' size="lg" value={password} onChange={handlePasswordChange}/>
                                {/* <MDBBtn className="mb-4 px-5" color='dark' size='lg' >登录</MDBBtn> */}
                                {/* <LoginButton />  */}
                                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>登入</MDBBtn>
                                {/* <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => navigate('/checkmain')}>登录</MDBBtn> */}
                                {/* <a className="small text-muted" href="#!">忘记密码?</a> */}
                                {/* <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>没有账户？ <a href="/register" style={{ color: '#54B4D3' }}>这里注册！</a></p> */}

                                <div className='d-flex flex-row justify-content-start'>
                                    {/* <a href="#!" className="small text-muted me-1">Terms of use.</a>
                        <a href="#!" className="small text-muted">Privacy policy</a> */}
                                </div>

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );

}

export default RLogin;
