import React from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {MDBBtn, MDBInput, MDBTable, MDBTableBody, MDBTableHead} from "mdb-react-ui-kit";

// THIS IS A TEST PAGE TO SEE IF THE BACKEND IS WORKING
export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.SearchFlight=this.SearchFlight.bind(this);
    }


    // async componentDidMount() {
    //     await fetch('http://localhost:8080/flight/query', {
    //         method: 'GET',
    //     }).then(res => res.json()).then(data => {
    //         this.setState({data: data});
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }

    async SearchFlight(from){
        alert(from);
        await fetch('http://localhost:8080/flight/query'+'?from='+from, {
            method: 'GET',
        })
            .then(res => res.json()).then(data => {
                this.setState({data:data});
            }).catch(err => {
                console.log(err);
            });
    }

    render() {

        return (
            <div>
                <Header />
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                    // let name=prompt("名称");
                    // let location=prompt("地址");
                    // let star=prompt("星级");
                    // let score=prompt("评分");
                    // this.AddHotel(name,location,star,score);
                }}>+新增酒店</MDBBtn>
                <MDBInput wrapperClass='mb-4' label='酒店名称' id='formControlLg' type='text' size="lg" />
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={()=>{this.SearchFlight(document.getElementById("formControlLg").value)}}>搜索</MDBBtn>
                <MDBTable>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>ID</th>
                            <th scope='col'>出发地</th>
                            <th scope='col'>目的地</th>
                            <th scope='col'>时间</th>
                            <th scope='col'>评分</th>
                            <th scope='col'>价格</th>
                            <th scope='col'>操作</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {this.state.data &&
                            this.state.data.map((item, index) => (
                                <tr>
                                    <th scope='row'>{item.id}</th>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{item.time}</td>
                                    <td>{item.score}</td>
                                    <td>{item.price}</td>
                                    <td><button id="update" onClick={()=>{
                                        // let name=prompt("名称");
                                        // let location=prompt("地址");
                                        // let star=prompt("星级");
                                        // let score=prompt("评分");
                                        // this.UpdateHotel(item.id,name,location,star,score);
                                    }}>修改</button>/<button id="delete" onClick={()=>{alert("id="+item.id+"删除成功！")}}>删除</button></td>
                                </tr>
                            ))}
                    </MDBTableBody>
                </MDBTable>
                <Footer />
            </div>
        )
    }

}
