import React from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {MDBBtn, MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdb-react-ui-kit";

// THIS IS A TEST PAGE TO SEE IF THE BACKEND IS WORKING
export default class hello extends React.Component {
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
    async componentDidMount() {
        await fetch('http://localhost:8080/hotel/query', {
            method: 'GET',
        }).then(res => res.json()).then(data => {
            this.setState({data: data});
        }).catch(err => {
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

    render() {
        let AdmID=null;
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
                <Header />
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                    let name=prompt("名称");
                    let location=prompt("地址");
                    let star=prompt("星级");
                    let score=prompt("评分");
                    this.AddHotel(name,location,star,score);
                }}>+新增酒店</MDBBtn>
                <MDBInput wrapperClass='mb-4' label='酒店名称' id='formControlLg' type='text' size="lg" />
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={()=>{this.SearchHotel(document.getElementById("formControlLg").value)}}>搜索</MDBBtn>
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
                                        let star=prompt("星级");
                                        let score=prompt("评分");
                                        this.UpdateHotel(item.id,name,location,star,score);
                                    }}>修改</button>/<button id="delete" onClick={()=>{this.DeleteHotel(item.id);alert("id="+item.id+"删除成功！")}}>删除</button></td>
                                </tr>
                            ))}
                    </MDBTableBody>
                </MDBTable>
                <Footer />
            </div>
        )
    }

}
