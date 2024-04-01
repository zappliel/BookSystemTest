import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    MDBBtn,
    MDBCol,
    MDBContainer,
    MDBInput,
    MDBRow,
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import React from 'react';
import BackNavigator from "../../components/navigator/backnavigator";
// import Footer from '../components/Footer';
// import Header from "../components/Header";

export default class TicketManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.SearchFlight=this.SearchFlight.bind(this);
        this.DeleteFlight=this.DeleteFlight.bind(this);
        this.AddFlight=this.AddFlight.bind(this);
        this.UpdateFlight=this.UpdateFlight.bind(this);
    }

    async UpdateFlight(id,discountFactor){
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

    async AddFlight(serviceId,discountFactor){
        await fetch('http://localhost:8080/discount/add', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'serviceId='+serviceId+'&type=FLIGHT'+'&discountFactor='+discountFactor
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
    async DeleteFlight(id){
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

    async SearchFlight(id){
        await fetch('http://localhost:8080/discount/query'+'?serviceId='+id+'&type=FLIGHT', {
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

        const new_token=localStorage.getItem('Token');
        const new_role=localStorage.getItem('role');
        if(!(new_token != '' && new_role=="ADMIN")) return (<p>Please Login in</p>);
        else
        return (
            <div>
                {/*<Header/>*/}
                <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
                    <MDBRow>
                        {/*<MDBCol size='12'>*/}
                        {/*    <h2>在线预定系统</h2>*/}
                        {/*</MDBCol>*/}
                        <MDBCol size='3'>
                            {/*<p><a href="http://localhost:3000/hotelManagePage" style={{color: "black"}}>酒店管理</a></p>*/}
                            {/*<p><a href="http://localhost:3000/flightManagePage" style={{color: "black"}}>航班管理</a>*/}
                            {/*</p>*/}
                            {/*<p><a href="http://localhost:3000/sproomManagePage" style={{color: "black"}}>特价房管理</a>*/}
                            {/*</p>*/}
                            {/*<p><a href="http://localhost:3000/ticketManagePage"*/}
                            {/*      style={{color: "black"}}>折扣机票管理</a></p>*/}
                            <BackNavigator/>
                        </MDBCol>
                        <MDBCol size='9'>
                            <h4>后台管理/折扣机票管理</h4>
                            <h3>折扣机票管理</h3>
                            <MDBInput wrapperClass='mb-4' label='航班ID' id='formControlLg' type='text'
                                      size="lg"/>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                this.SearchFlight(document.getElementById("formControlLg").value)
                            }}>搜索</MDBBtn>
                            <h5>搜索结果</h5>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                let hotelID=prompt("航班ID(请保证航班ID存在并且未曾登记为折扣机票)");
                                let discountFactor=prompt("折扣力度 例如0.5");
                                let S=parseFloat(discountFactor);
                                if(S>0 && S<1 && S!=NaN) this.AddFlight(hotelID,discountFactor);
                                else alert("Insert ERROR");
                            }}>+新增折扣机票</MDBBtn>
                            <MDBTable>
                                <MDBTableHead>
                                    <tr>
                                        <th scope='col'>ID</th>
                                        <th scope='col'>航班ID</th>
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
                                            if(S>0 && S<1 && S!=NaN) this.UpdateFlight(item.id,discountFactor);
                                            else alert("Update ERROR");
                                        }}>修改</button>/<button id="delete" onClick={()=>{
                                            this.DeleteFlight(item.id);
                                            alert("id="+item.id+"删除成功！")}
                                        }>删除</button></td>
                                    </tr>

                                    ))}
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                {/*<Footer/>*/}
            </div>
        );
    }
}
