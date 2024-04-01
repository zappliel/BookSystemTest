import React from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {MDBBtn, MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdb-react-ui-kit";

// THIS IS A TEST PAGE TO SEE IF THE BACKEND IS WORKING
export default class hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            _data:[]
        }
        this.SearchRoom=this.SearchRoom.bind(this);
        this.DeleteRoom=this.DeleteRoom.bind(this);
        this.AddRoom=this.AddRoom.bind(this);
        this.UpdateRoom=this.UpdateRoom.bind(this);
        this.SearchHotelRoom=this.SearchHotelRoom.bind(this);
        // this.GetPrice=this.GetPrice.bind(this);
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

    async SearchHotelRoom(id){
        await fetch('http://localhost:8080/room/query'+'?hotelId='+id, {
            method: 'GET',
        })
            .then(res => res.json()).then(data => {
                this.setState({_data:data});
            }).catch(err => {
                console.log(err);
            });
    }

    // GetPrice(id){
    //     let Price;
    //     this.SearchHotel(id);
    //     this.state._data.map((item) =>
    //         (Price=item.price));
    // }

    render() {
        return (
            <div>
                <Header />
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                    let hotelID=prompt("酒店ID");
                    let discountFactor=prompt("折扣力度");
                    this.AddRoom(hotelID,discountFactor);
                }}>+新增特价房</MDBBtn>
                <MDBInput wrapperClass='mb-4' label='酒店ID' id='formControlLg' type='text' size="lg" />
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={()=>{this.SearchRoom(document.getElementById("formControlLg").value);}}>搜索</MDBBtn>
                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>ID</th>
                            <th scope='col'>酒店ID</th>
                            <th scope='col'>房间类型</th>
                            <th scope='col'>折扣力度</th>
                            <th scope='col'>价格</th>
                            <th scope='col'>操作</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {
                                this.state.data.map((item,index) => {
                                    this.SearchHotelRoom(item.serviceId);
                                    this.state._data.map((Item,Index)=> {
                                            return(
                                            <tr>
                                                <th scope='row'>{Item.id}</th>
                                                <td>{Item.hotelId}</td>
                                                <td>{Item.roomClass}</td>
                                                <td>{item.discountFactor}</td>
                                                <td>{Item.price * item.discountFactor}</td>
                                                <td>
                                                    <button id="update" onClick={() => {
                                                        let discountFactor = prompt("折扣力度");
                                                        this.UpdateRoom(item.id, discountFactor);
                                                    }}>修改
                                                    </button>
                                                    /
                                                    <button id="delete" onClick={() => {
                                                        this.DeleteRoom(item.id);
                                                        alert("id=" + item.id + "删除成功！")
                                                    }
                                                    }>删除
                                                    </button>
                                                </td>
                                            </tr>
                                            )
                                        }

                                    )
                                // return(
                                //  <tr>
                                //      <th scope='row'>{item.id}</th>
                                //      <td>{item.serviceId}</td>
                                //      <td>{item.discountFactor}</td>
                                //      {/*<td>{item.price}</td>*/}
                                //      <td>
                                //          <button id="update" onClick={() => {
                                //              let discountFactor = prompt("折扣力度");
                                //              this.UpdateRoom(item.id, discountFactor);
                                //          }}>修改
                                //          </button>
                                //          /
                                //          <button id="delete" onClick={() => {
                                //              this.DeleteRoom(item.id);
                                //              alert("id=" + item.id + "删除成功！")
                                //          }
                                //          }>删除
                                //          </button>
                                //      </td>
                                //  </tr>)
                                }

                             )
                        }
                    </MDBTableBody>
                </MDBTable>
                <Footer />
            </div>
        )
    }

}
