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

export default class HotelManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.SearchHotel=this.SearchHotel.bind(this);
        this.DeleteHotel=this.DeleteHotel.bind(this);
        this.AddHotel=this.AddHotel.bind(this);
        this.UpdateHotel=this.UpdateHotel.bind(this);
    }
    async SearchHotel(name){
        await fetch('http://localhost:8080/hotel/query'+'?name='+name, {
            method: 'GET',
        })
            .then(res => res.json()).then(data => {
                this.setState({data:data});
            }).catch(err => {
                console.log(err);
            });
    }
    async DeleteHotel(id){
        await fetch('http://localhost:8080/hotel/delete'+'?id='+id, {
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

    async AddHotel(name,location,star,score){
        await fetch('http://localhost:8080/hotel/add', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'name='+name+'&location='+location+'&star='+star+'&score='+score
        })
            .then(
                res=>{
                    console.log(res)
                }

            ).catch(err => {
                console.log(err);
            });
    }
    async UpdateHotel(id,name,location,star,score){
        await fetch('http://localhost:8080/hotel/update'+'?id='+id, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'name='+name+'&location='+location+'&star='+star+'&score='+score
        })
            .then(
                res=>{
                    console.log(res)
                }

            ).catch(err => {
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
                            <h4>后台管理/酒店管理</h4>
                            <h3>酒店管理</h3>
                            <MDBInput wrapperClass='mb-4' label='酒店名称' id='formControlLg' type='text' size="lg"/>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                this.SearchHotel(document.getElementById("formControlLg").value)
                            }}>搜索</MDBBtn>
                            <h5>搜索结果</h5>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                let name=prompt("名称");
                                let location=prompt("地址");
                                let star=prompt("星级 例如4");
                                let score=prompt("评分 例如58.63");
                                let S=parseFloat(score);
                                if((star!="1" && star!="2" && star!="3" && star!="4" && star!="5") || (S>100 || S<0 || S==NaN)) alert("Insert ERROR");
                                else this.AddHotel(name,location,star,score);
                            }}>+新增酒店</MDBBtn>
                            <MDBTable>
                                <MDBTableHead>
                                    <tr>
                                        <th scope='col'>ID</th>
                                        <th scope='col'>名称</th>
                                        <th scope='col'>地址</th>
                                        <th scope='col'>星级</th>
                                        <th scope='col'>评分</th>
                                        <th scope='col'>操作</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {this.state.data &&
                                        this.state.data.map((item, index) => (
                                            <tr>
                                                <th scope='row'>{item.id}</th>
                                                <td>{item.name}</td>
                                                <td>{item.location}</td>
                                                <td>{item.star}</td>
                                                <td>{item.score}</td>
                                                <td><button id="update" onClick={()=>{
                                                    let name=prompt("名称");
                                                    let location=prompt("地址");
                                                    let star=prompt("星级 例如4");
                                                    let score=prompt("评分 例如58.63");
                                                    if((name=="" || location==""||star=="" || score=="")) alert("Update ERROR");
                                                    else{
                                                        let S=parseFloat(score);
                                                        if((star!="1" && star!="2" && star!="3" && star!="4" && star!="5") || (S>100 || S<0 || S==NaN)) alert("Update ERROR");
                                                        else this.UpdateHotel(item.id,name,location,star,score);}
                                                    }}>修改</button>/<button id="delete" onClick={()=>{this.DeleteHotel(item.id);alert("id="+item.id+"删除成功！")}}>删除</button></td>


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
