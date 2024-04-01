import React from 'react';
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
    MDBInput, MDBTable, MDBTableHead, MDBTableBody
}
    from 'mdb-react-ui-kit';
import Footer from '../components/Footer';
import Header from "../components/Header";

export default class SPRoomManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.SearchRoom=this.SearchRoom.bind(this);
        this.DeleteRoom=this.DeleteRoom.bind(this);
        this.AddRoom=this.AddRoom.bind(this);
        this.UpdateRoom=this.UpdateRoom.bind(this);
    }

    async UpdateRoom(id,discountFactor){
        await fetch('http://localhost:8080/discount/update'+'?id='+id, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'discountFactor='+discountFactor
        })
            .then(
                res=>{
                    console.log(res)
                }

            ).catch(err => {
                console.log(err);
            });
    }

    async AddRoom(serviceId,discountFactor){
        await fetch('http://localhost:8080/discount/add', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'serviceId='+serviceId+'&type=HOTEL'+'&discountFactor='+discountFactor
        })
            .then(
                res=>{
                    console.log(res)
                }

            ).catch(err => {
                console.log(err);
            });
    }
    //
    async DeleteRoom(id){
        await fetch('http://localhost:8080/discount/delete'+'?id='+id, {
            method: 'DELETE',
        })
            .then(
                res=>{
                    console.log(res)
                }

            ).catch(err => {
                console.log(err);
            });
    }

    async SearchRoom(id){
        await fetch('http://localhost:8080/discount/query'+'?serviceId='+id+'&type=HOTEL', {
            method: 'GET',
        })
            .then(res => res.json()).then(data => {
                this.setState({data:data});
            }).catch(err => {
                console.log(err);
            });
    }
    render() {
        const renderData = this.state.data.map((data) => {
            return (
                <div>
                    <p>{data.name}</p>
                </div>
            )
        });
        let AdmID="null";
        if(AdmID==null) return (
            <div>
                <Header />
                <p>Please Login</p>
                <Footer />
            </div>
        )
        else
        return (
            <div>
                <Header/>
                <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
                    <MDBRow>
                        <MDBCol size='12'>
                            <h2>在线预定系统</h2>
                        </MDBCol>
                        <MDBCol size='3'>
                            <p><a href="http://localhost:3000/hotelManagePage" style={{color: "black"}}>酒店管理</a></p>
                            <p><a href="http://localhost:3000/flightManagePage" style={{color: "black"}}>航班管理</a>
                            </p>
                            <p><a href="http://localhost:3000/sproomManagePage" style={{color: "black"}}>特价房管理</a>
                            </p>
                            <p><a href="http://localhost:3000/ticketManagePage"
                                  style={{color: "black"}}>折扣机票管理</a></p>
                        </MDBCol>
                        <MDBCol size='9'>
                            <h4>后台管理/特价房管理</h4>
                            <h3>特价房管理</h3>
                            <MDBInput wrapperClass='mb-4' label='酒店ID' id='formControlLg' type='text' size="lg"/>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                this.SearchRoom(document.getElementById("formControlLg").value)
                            }}>搜索</MDBBtn>
                            <h5>搜索结果</h5>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                let hotelID=prompt("酒店ID(请保证酒店ID存在并且未曾登记为特价房)");
                                let discountFactor=prompt("折扣力度 例如0.5");
                                let S=parseFloat(discountFactor);
                                if(S>0 && S<1 && S!=NaN) this.AddRoom(hotelID,discountFactor);
                                else alert("Insert ERROR");
                            }}>+新增特价房</MDBBtn>
                            <MDBTable>
                                <MDBTableHead>
                                    <tr>
                                        <th scope='col'>ID</th>
                                        <th scope='col'>酒店ID</th>
                                        {/*<th scope='col'>房间类型</th>*/}
                                        <th scope='col'>折扣力度</th>
                                        {/*<th scope='col'>评分</th>*/}
                                        <th scope='col'>操作</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {
                                        this.state.data &&
                                        this.state.data.map((item) =>
                                            (
                                                <tr>
                                                    <th scope='row'>{item.id}</th>
                                                    <td>{item.serviceId}</td>
                                                    <td>{item.discountFactor}</td>
                                                    {/*<td>{item.price}</td>*/}
                                                    <td><button id="update" onClick={()=>{
                                                        let discountFactor=prompt("折扣力度 例如0.5");
                                                        let S=parseFloat(discountFactor);
                                                        if(S>0 && S<1 && S!=NaN) this.UpdateRoom(item.id,discountFactor);
                                                        else alert("Update ERROR");
                                                    }}>修改</button>/<button id="delete" onClick={()=>{
                                                        this.DeleteRoom(item.id);
                                                        alert("id="+item.id+"删除成功！")}
                                                    }>删除</button></td>
                                                </tr>

                                            ))}
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <Footer/>
            </div>
        );
    }
}

