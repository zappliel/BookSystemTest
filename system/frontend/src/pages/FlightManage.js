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

export default class FlightManage extends React.Component {
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
    async SearchFlight(name){
        await fetch('http://localhost:8080/flight/query'+'?from='+name, {
            method: 'GET',
        })
            .then(res => res.json()).then(data => {
            this.setState({data:data});
        }).catch(err => {
            console.log(err);
        });
    }

    async DeleteFlight(id){
        await fetch('http://localhost:8080/flight/delete'+'?id='+id, {
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
    async AddFlight(from,to,dtime,atime,price,score,num){
        await fetch('http://localhost:8080/flight/add', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'from='+from+'&to='+to+'&departureTime='+dtime+'&arrivalTime='+atime+'&price='+price+'&score='+score+'&seatNum='+num
        })
            .then(
                res=>{
                    console.log(res)
                }

            ).catch(err => {
                console.log(err);
            });
    }
    async UpdateFlight(id,from,to,departureTime,arrivalTime,price,score,seatNum){
        await fetch('http://localhost:8080/flight/update'+'?id='+id, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body:'from='+from+'&to='+to+'&departureTime='+departureTime+'&arrivalTime='+arrivalTime +'&price='+price+'&score='+score+'&seatNum='+seatNum
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
        let AdmID="AdmID";
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
                            <h4>后台管理/航班管理</h4>
                            <h3>航班管理</h3>
                            <MDBInput wrapperClass='mb-4' label='航班出发地' id='formControlLg' type='text' size="lg"/>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                this.SearchFlight(document.getElementById("formControlLg").value);
                            }}>搜索</MDBBtn>
                            <h5>搜索结果</h5>
                            <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={() => {
                                // let str='2020-10-20 12:00:00';
                                // alert(new Date(str.replace(/-/g,'/')).getTime());
                                let From=prompt("出发地");
                                let To=prompt("目的地");
                                let DTime=prompt("出发时间 例如2012-12-12 12:12:12");
                                let ATime =prompt("到达时间 例如2012-12-12 12:12:12");
                                let Price=prompt("价格");
                                let Score=prompt("评分 例如58.63");
                                let Num=prompt("座位数");
                                let D1=new Date(DTime.replace(/-/g,'/')).getTime();
                                let D2=new Date(ATime.replace(/-/g,'/')).getTime();
                                let f=1;
                                let S=parseFloat(Score);
                                let P=parseFloat(Price);
                                if(S>100 || S<0 || S==NaN || P<0 || P==NaN) f=0;
                                if(D1>=D2 || From=="" || To=="" || DTime=="" || ATime=="" || Price=="" || Score=="" || Num=="") f=0;
                                if(f==0)    alert("Insert Error!");
                                else this.AddFlight(From,To,8*60*60*1000+D1,8*60*60*1000+D2,Price,Score,Num);
                            }}>+新增航班</MDBBtn>
                            <MDBTable>
                                <MDBTableHead>
                                    <tr>
                                        <th scope='col'>ID</th>
                                        <th scope='col'>出发地</th>
                                        <th scope='col'>目的地</th>
                                        <th scope='col'>出发时间</th>
                                        <th scope='col'>到达时间</th>
                                        <th scope='col'>评分</th>
                                        <th scope='col'>价格</th>
                                        <th scope='col'>乘客数</th>
                                        <th scope='col'>操作</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {this.state.data &&
                                        this.state.data.map((item) => (
                                            <tr>
                                                <th scope='row'>{item.id}</th>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>{item.departureTime}</td>
                                                <td>{item.arrivalTime}</td>
                                                <td>{item.score}</td>
                                                <td>{item.price}</td>
                                                <td>{item.seatNum}</td>
                                                <td><button id="update" onClick={()=>{
                                                    let From=prompt("出发地");
                                                    let To=prompt("目的地");
                                                    let DTime=prompt("出发时间 例如2012-12-12 12:12:12");
                                                    let ATime =prompt("到达时间 例如2012-12-12 12:12:12");
                                                    let Price=prompt("价格");
                                                    let Score=prompt("评分 例如58.63");
                                                    let Num=prompt("座位数");
                                                    let D1=new Date(DTime.replace(/-/g,'/')).getTime();
                                                    let D2=new Date(ATime.replace(/-/g,'/')).getTime();
                                                    let f=1;
                                                    let S=parseFloat(Score);
                                                    let P=parseFloat(Price);
                                                    if(S>100 || S<0 || S==NaN || P<0 || P==NaN) f=0;
                                                    if(D1>=D2 || From=="" || To=="" || DTime=="" || ATime=="" || Price=="" || Score=="" || Num=="") f=0;
                                                    if(f==0) alert("Update Error!");
                                                    else this.UpdateFlight(item.id,From,To,8*60*60*1000+D1,8*60*60*1000+D2,Price,Score,Num);
                                                }}>修改</button>/<button id="delete" onClick={()=>{this.DeleteFlight(item.id);alert("id="+item.id+"删除成功！")}}>删除</button></td>
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
