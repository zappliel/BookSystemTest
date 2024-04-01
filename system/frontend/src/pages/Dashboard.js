import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBInput,
    MDBInputGroup,
    MDBRow,
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import React, { useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import Footer from "../components/Footer";
import MyTable from "../components/MyTable";
import { backendPort } from "../global/global";
import MyLinechart1 from "../components/MyLinechart1";
import MyLinechart2 from "../components/MyLinechart2";

function Dashboard() {
    const new_token = localStorage.getItem('Token');
    const [showBasic, setShowBasic] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [delta, setDelta] = useState('0');
    const [balance, setBalance] = useState('');
    const [paymentPassword, setPaymentPassword] = useState('');
    const [monthshowModal,setMonthshowModal] = useState(false);
    const [monthLine, setMonthLine] = useState(false);
    const [yearshowModal,setYearshowModal] = useState(false);

    const [month, setMonth] = useState('0');
    const [year, setYear] = useState('0');
    const [time, setTime] = useState('0');
    const [amont, setAmont] = useState('0');
    const [delta2, setDelta2] = useState('0');
    const [msg2, setmsg2] = useState('0');
    const [data, setData] = useState({});

  
    const handleBalance = (event) => {
        setBalance(event.target.value);
    }

    const handleShowBalance = () => {
        setBalance(localStorage.getItem('balance'));
    }
    const handlePaymentPassword = (event) => {
        setPaymentPassword(event.target.value);
    }
    const handleSetDeltaTwe = () => {
        if(delta == ''){
            setDelta('20');
        }else{
            let num_Delta = parseFloat(delta);
            num_Delta += 20;
            setDelta(num_Delta.toString());
        }
    }
    const handleSetDeltaFif = () => {
        if(delta == ''){
            setDelta('50');
        }else{
            let num_Delta = parseFloat(delta);
            num_Delta += 50;
            setDelta(num_Delta.toString());
        }

    }
    const handleSetDeltaHun = () => {
        if(delta == ''){
            setDelta('100');
        }else{
            let num_Delta = parseFloat(delta);
            num_Delta += 100;
            setDelta(num_Delta.toString());
        }

    }
    const handleSetDeltaTHun = () => {
        if(delta == ''){
            setDelta('200');
        }else{
            let num_Delta = parseFloat(delta);
            num_Delta += 200;
            setDelta(num_Delta.toString());
        }

    }
    const handleSetDeltaFHun = () => {
        if(delta == ''){
            setDelta('500');
        }else{
            let num_Delta = parseFloat(delta);
            num_Delta += 500;
            setDelta(num_Delta.toString());
        }

    }

    const handleDeltaChange = (event) => {
        setDelta(event.target.value);
    }
    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setPaymentPassword('');
        setShowModal(false);
    };

    const handleConfirm = () => {
        setPaymentPassword('');
        setShowModal(false);
        // do something
    };
    const handleTopup = () => {
        const data = {
            delta: delta,
            paymentPassword: paymentPassword
        }
        const Token = localStorage.getItem('Token');
        console.log(Token);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${Token}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };

        fetch(`http://${backendPort}/api/v1/user/top-up`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                if(result.statusCode == 'SUCCESS'){
                    let new_balance = parseFloat(delta) + parseFloat(balance);
                    localStorage.setItem('balance', new_balance.toString());
                    setBalance(new_balance.toString());
                    setDelta('0');
                    alert(result.message);
                }else{
                    setDelta('0');
                    alert(result.message);
                }
            })
            .catch(error => console.log('error', error));
    }
    const handleMonth = () => {
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
        fetch(`http://${backendPort}/api/v1/buyer/analysed-transaction-history`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                const data = result.data;
                setData(data);
                console.log(data);
                if(result.statusCode == 'SUCCESS'){
                    setMonthshowModal(true);
                    console.log(monthshowModal);

                    //MyTable({data});
                }else{

                }
            })
            .catch(error => console.log('error', error))
    }
    const handleMonthLine = () => {
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
        fetch(`http://${backendPort}/api/v1/buyer/analysed-transaction-history`, requestOptions)
            .then(reponse => reponse.json())
            .then(result => {
                console.log(result);
                const data = result.data;
                //console.log(array);
                setData(data);
                console.log(data);
                if(result.statusCode == 'SUCCESS'){
                    setMonthLine(true);
                    console.log(monthLine);
                    //MyTable({data});
                }else{

                }
            })
            .catch(error => console.log('error', error))
    }
    return (
        <div>
            {new_token != '' ? (
                <div>
                    <div>
                        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
                            <Modal show={showModal} onHide={handleCancel}>
                                <Modal.Header closeButton>
                                    <Modal.Title>充值验证</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h2>请输入支付密码</h2>
                                    <MDBInput wrapperClass='mb-4' label='支付密码' id='form5' type='password' value={paymentPassword} onChange={handlePaymentPassword}/>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCancel}>
                                        取消
                                    </Button>
                                    <Button variant="primary" onClick={() => {
                                        handleTopup();
                                        handleConfirm();
                                    }}>
                                        确认
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            
                            <MDBRow className='text-center'>
                            <MDBCol md = '4'></MDBCol>
                                <MDBCol md='6' className='position-relative'>
                                    <MDBRow className='me-4 text-center'>
                                        <MDBCard className='my-5 bg-glass'>
                                            <MDBCardTitle className='h1'>余额/充值</MDBCardTitle>
                                            <MDBCardBody className='p-5'>
                                                <MDBInputGroup className='mb-3' textAfter=''>
                                                    <MDBInput className='form-control' label='余额'  type='text' value={balance} onChange={handleBalance} disabled/>
                                                    <MDBBtn className='me-4' onClick={handleShowBalance}>显示余额</MDBBtn>
                                                </MDBInputGroup>
                                                <MDBInputGroup className='mb-3' textBefore='¥' textAfter=''>
                                                    <input className='form-control' type='text' value={delta} onChange={handleDeltaChange}/>
                                                    <MDBBtn className='me-4' onClick={handleButtonClick}>充值</MDBBtn>
                                                </MDBInputGroup>
                                                <MDBBtn className='me-4' onClick={handleSetDeltaTwe}>20¥</MDBBtn>
                                                <MDBBtn className='me-4' onClick={handleSetDeltaFif}>50¥</MDBBtn>
                                                <MDBBtn className='me-4' onClick={handleSetDeltaHun}>100¥</MDBBtn>
                                                <MDBBtn className='me-4' onClick={handleSetDeltaTHun}>200¥</MDBBtn>
                                                <MDBBtn className='me-4' onClick={handleSetDeltaFHun}>500¥</MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBRow>
                                </MDBCol>
                            </MDBRow>
                            {/* <MDBCol md = '5'><MDBBtn className='me-4' onClick={handleMonth}>更新</MDBBtn></MDBCol> */}
                            <MDBRow className='text-center'>
                                <MDBCol md='4'></MDBCol>
                                    {/* <MDBCol md='12'></MDBCol> */}
                                <MDBCol md = '6'>
                                <MDBBtn className='me-4' onClick={handleMonth}>更新</MDBBtn>
                                
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className='text-center'>
                            <MDBCol md = '4'></MDBCol>
                                <MDBCol md='6' className='position-relative'>
                                    <MDBRow className='me-5 text-center'>
                                        <div>
                                            {monthshowModal ?<p>
                                                {MyTable({data})}
                                            </p> :<p>
                                                <MDBCard className='my-5 bg-glass'>
                                                    <MDBCardTitle className='h1'>月度统计信息</MDBCardTitle>
                                                    <MDBCardBody className='p-5'>
                                                        <MDBTable>
                                                            <MDBTableHead>
                                                                <tr>
                                                                    <th scope='col'>年份</th>
                                                                    <th scope='col'>月份</th>
                                                                    <th scope='col'>余额变化</th>
                                                                </tr>
                                                            </MDBTableHead>
                                                            <MDBTableBody>
                                                                <tr>

                                                                    <td>
                                                                        <p>暂无数据</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className='text-muted mb-0'>暂无数据</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className='fw-normal mb-1'>暂无数据</p>
                                                                    </td>
                                                                </tr>
                                                            </MDBTableBody>
                                                        </MDBTable>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </p>}
                                        </div>
                                    </MDBRow>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className='text-center'>
                                <MDBCol md = '2'></MDBCol>
                                <MDBCol md='5' className='position-relative'>
                                    <MDBRow className='me-5 text-center'>
                                        <div>
                                            {monthshowModal ?<p>
                                                {MyLinechart1({data})}
                                            </p> :<p>
                                                <MDBCard className='my-5 bg-glass'>
                                                    <MDBCardTitle className='h1'>月度统计折线图</MDBCardTitle>
                                                    <MDBCardBody className='p-5'>
                                                        <MDBTable>
                                                            <MDBTableHead>
                                                                <tr>
                                                                    <th scope='col'>月份</th>
                                                                    {/*<th scope='col'>时间</th>*/}
                                                                    <th scope='col'>余额变化</th>
                                                                </tr>
                                                            </MDBTableHead>
                                                            <MDBTableBody>
                                                                <tr>

                                                                    <td>
                                                                        <p>暂无数据</p>
                                                                    </td>
                                                                    {/*<td>*/}
                                                                    {/*    <p className='text-muted mb-0'>暂无数据</p>*/}
                                                                    {/*</td>*/}
                                                                    <td>
                                                                        <p className='fw-normal mb-1'>暂无数据</p>
                                                                    </td>
                                                                </tr>
                                                            </MDBTableBody>
                                                        </MDBTable>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </p>}
                                        </div>
                                    </MDBRow>
                                </MDBCol>
                                <MDBCol md='5' className='position-relative'>
                                    <MDBRow className='me-5 text-center'>
                                        <div>
                                            {monthshowModal ?<p>
                                                {MyLinechart2({data})}
                                            </p> :<p>
                                                <MDBCard className='my-5 bg-glass'>
                                                    <MDBCardTitle className='h1'>年度统计折线图</MDBCardTitle>
                                                    <MDBCardBody className='p-5'>
                                                        <MDBTable>
                                                            <MDBTableHead>
                                                                <tr>
                                                                    <th scope='col'>年份</th>
                                                                    {/*<th scope='col'>时间</th>*/}
                                                                    <th scope='col'>余额变化</th>
                                                                </tr>
                                                            </MDBTableHead>
                                                            <MDBTableBody>
                                                                <tr>

                                                                    <td>
                                                                        <p>暂无数据</p>
                                                                    </td>
                                                                    {/*<td>*/}
                                                                    {/*    <p className='text-muted mb-0'>暂无数据</p>*/}
                                                                    {/*</td>*/}
                                                                    <td>
                                                                        <p className='fw-normal mb-1'>暂无数据</p>
                                                                    </td>
                                                                </tr>
                                                            </MDBTableBody>
                                                        </MDBTable>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            </p>}
                                        </div>
                                    </MDBRow>
                                </MDBCol>
                                </MDBRow>
                            {/* 两个卡片结束 */}
                        </MDBContainer>
                    </div>
                </div>
            ):(
                <div>
                    <MDBContainer className="my-5 text-center">
                        <h1>Page not found.</h1>
                    </MDBContainer>
                    <Footer />
                </div>
            )}
        </div>
     
    );
}

export default Dashboard
