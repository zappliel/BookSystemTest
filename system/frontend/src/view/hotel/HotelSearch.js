import {
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Layout,
    Modal,
    Row,
    message,
    Select,
    Space,
    Table
} from 'antd';
import axios from 'axios';
import Qs from 'qs';
import React from 'react';
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import {backendPort} from "../../global/global";

const { RangePicker } = DatePicker;
const { Meta } = Card;
const  { Search } = Input;
function formatDate(value) {
    var date = new Date(value);
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    var t = y + '-' + m + '-' + d;
    console.log(t);
    return t;
}
export default class HotelSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            allData: [],
            roomData: [],
            comment: [],
            discountDate: [],
            visible: false,
            _score: 0,
            _comment:"",
            name: "",
            location: "",
            minStar: 1,
            maxStar: 5,
            form: 2,
            preform: 0,
            minPrice: 1.0,
            hotelId: 0,
            hotelName: "",
            hotelLocation: "",
            loading: false,
            startdate: 0,
            enddate: 0,
            recordPrice:0,
            recordId:0,
            inputpassword:"",
            hotelorderid:0,
            curID:localStorage.getItem("userId"),
        }
    }
    formRef = React.createRef();
    handleComment = () => {
        this.setState({visible:false})
        this.postComment()
    }
    handleFinish = () => {

    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    selectDate = (value) => {
        this.setState({startdate: value[0],enddate: value[1]})
    }
    selectHotel = (value) => {
        this.setState({hotelId: value.id,hotelName:value.name, hotelLocation:value.location,preform:this.state.form,form: 1})
        this.setState({loading: true})
        const params = {
            hotel_id: value.id
        }
        axios.get('http://localhost:8080/room/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({roomData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    viewComment = (value) => {
        this.setState({hotelId: value.id,hotelName:value.name, hotelLocation:value.location,preform:this.state.form,form: 3})
        this.setState({loading: true})
        const params = {
            serviceId: value.id,
            type: "HOTEL",
        }
        axios.get('http://localhost:8080/comment/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({comment: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    selectDiscount = (value) => {
        this.setState({hotelId: value.serviceId,hotelName:this.getHotelName(value), hotelLocation:this.getHotelLocation(value),preform:this.state.form,form: 1})
        console.log("name"+this.state.hotelName);
        this.setState({loading: true})
        const params = {
            hotelId: value.serviceId
        }
        axios.get('http://localhost:8080/room/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({roomData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    viewDiscountComment = (value) => {
        this.setState({hotelId: value.serviceId,hotelName:this.getHotelName(value), hotelLocation:this.getHotelLocation(value),preform:this.state.form,form: 3})
        this.setState({loading: true})
        const params = {
            serviceId: value.serviceId,
            type: "HOTEL",
        }
        axios.get('http://localhost:8080/comment/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({comment: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    selectStar = (value) => {
        if(value === 0){
            this.setState({minStar: 1,maxStar: 5})
        }
        else{
            this.setState({minStar: value, maxStar: value})
        }
    }
    bookRoom = (record) => {
        if(this.state.startdate === 0 || this.state.enddate === 0){
            message.info("请选择时间");
        }else{
            this.setState({form:4,recordPrice:record.price,recordId:record.id})
        }

    }
    goDiscount = () =>{
        this.loadDiscount()
        this.setState({preform:this.state.form,form:2})
    }
    goBack = () =>{
        this.setState({form:this.state.preform})
    }
    searchName = (value) => {
        this.setState({loading: true})
        this.setState({preform:this.state.form,form:0})
        const params = {
            name: value,
            maxStar: this.state.maxStar,
            minStar: this.state.minStar,
        }
        axios.get('http://localhost:8080/hotel/query', {
            params
        }).then((res ) => {
            this.setState({loading: false})
            this.setState({data: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    searchLocation = (value) => {
        this.setState({loading: true})
        this.setState({preform:this.state.form,form:0})
        const params = {
            location: value,
            maxStar: this.state.maxStar,
            minStar: this.state.minStar,
        }
        axios.get('http://localhost:8080/hotel/query', {
            params
        }).then((res ) => {
            this.setState({loading: false})
            this.setState({data: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    getHotelStar = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return item.star
            }
        })
    }
    getHotelName = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return item.name;
            }
        })
    }
    getHotelLocation = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return item.location;
            }
        })
    }
    loadData = () => {
        this.setState({loading: true})
        const params = {
            location: this.state.location,
            name: this.state.name,
            maxStar: this.state.maxStar,
            minStar: this.state.minStar,
        }
        axios.get('http://localhost:8080/hotel/query', {
            params
        }).then((res ) => {
            this.setState({loading: false})
            this.setState({data: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadRoom = () => {
        this.setState({loading: true})
        const params = {
            hotelId: this.state.hotelId
        }
        axios.get('http://localhost:8080/room/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({roomData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadComment = () => {
        this.setState({loading: true})
        const params = {
            serviceId: this.state.hotelId,
            type: "HOTEL",
        }
        axios.get('http://localhost:8080/comment/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({comment: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadDiscount = () => {
        this.setState({loading: true})
        const params = {
            type: "HOTEL",
        }
        axios.get('http://localhost:8080/discount/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({discountData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadAll = () => {
        this.setState({loading: true})
        const params = {
        }
        axios.get('http://localhost:8080/hotel/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({loading: false})
            this.setState({allData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    postComment = () => {
        const data = {
            "customerId": this.state.curID,
            "serviceId": this.state.hotelId,
            "type": "HOTEL",
            "score": this.formRef.current.getFieldsValue("score").score,
            "content": this.formRef.current.getFieldsValue("comment").comment
        }
        axios({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: 'http://localhost:8080/comment/add',
            method: "post",
            data: Qs.stringify(data)
        }).then(res => {
            console.log(res)
            message.info("评论成功");
        }).catch(function (error) {
                console.log(error);
            });
    }
    inputpasswordChange=(e)=>{
        this.setState({inputpassword:e.target.value},()=>console.log(this.state.inputpassword));
    }
    handleButtonClick = () => {
            const post_data={
                delta:this.state.recordPrice,
                paymentPassword:this.state.inputpassword
            }
            console.log(Input.TextArea.value);
            const Token = localStorage.getItem('Token');
            console.log(Token);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("Content-Type", "application/json");
    
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(post_data),
                redirect: 'follow'
            };
            fetch(`http://${backendPort}/api/v1/user/transfer`, requestOptions)
                .then(reponse => reponse.json())
                .then(result => {
                    console.log(result);
                    if(result.statusCode == 'SUCCESS'){
                        console.log(formatDate(this.state.startdate))
                        const data = {
                            "customer_id": this.state.curID,
                            "service_id": this.state.hotelId,
                            "status": "PAID",
                            "type": "HOTEL",
                            "price": this.state.recordPrice,
                            "room_id": this.state.recordId,
                            "check_in": formatDate(this.state.startdate),
                            "check_out": formatDate(this.state.enddate),
                        }
                        axios({
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            url: 'http://localhost:8080/order/add',
                            method: "post",
                            data: Qs.stringify(data)
                        }).then(res => {
                            console.log(res)
                        }).catch(function (error) {
                            console.log(error);
                        });
                        window.location.href="http://localhost:3000/ordersuccess"
                    }else{
                        console.log(formatDate(this.state.startdate))
                        const data = {
                            "customer_id": this.state.curID,
                            "service_id": this.state.hotelId,
                            "status": "UNPAID",
                            "type": "HOTEL",
                            "price": this.state.recordPrice,
                            "room_id": this.state.recordId,
                            "check_in": formatDate(this.state.startdate),
                            "check_out": formatDate(this.state.enddate),
                        }
                        axios({
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            url: 'http://localhost:8080/order/add',
                            method: "post",
                            data: Qs.stringify(data)
                        }).then(res => {
                            console.log(res)
                        }).catch(function (error) {
                            console.log(error);
                        });
                        window.location.href="http://localhost:3000/ordererror"
                    }
                })
                .catch(error => console.log('error', error));
    }
    handleButtonCancel = () =>{
        console.log(formatDate(this.state.startdate))
        const data = {
            "customer_id": this.state.curID,
            "service_id": this.state.hotelId,
            "status": "CANCELED",
            "type": "HOTEL",
            "price": this.state.recordPrice,
            "room_id": this.state.recordId,
            "check_in": formatDate(this.state.startdate),
            "check_out": formatDate(this.state.enddate),
        }
        axios({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: 'http://localhost:8080/order/add',
            method: "post",
            data: Qs.stringify(data)
        }).then(res => {
            console.log(res)
        }).catch(function (error) {
            console.log(error);
        });
        window.location.href="http://localhost:3000/ordercanceled"

    }

    async componentDidMount() {
        this.loadData()
        this.loadAll()
        this.loadDiscount()
    }

    render() {
        const columns = [
            {
                title: '酒店名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            },
            {
                title: '位置',
                dataIndex: 'location',
                key: 'location',
                align: 'center',
            },
            {
                title:'星级',
                dataIndex: 'star',
                key: 'star',
                align: 'center',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.star - b.star,
            },
            {
                title: '评分',
                dataIndex: 'score',
                key: 'score',
                align: 'center',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.score - b.score,
            },
            {
                title:'',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: 200,
                render:(text,record)=>(
                    <space size="large">
                        <Button type="default" onClick={()=>{this.selectHotel(record)}}>订房间</Button>
                        <Button type="default" onClick={()=>{this.viewComment(record)}}>看评价</Button>
                    </space>
                )
            }
        ];

        const roomColumns = [
            {
                title: '酒店名称',
                key: 'hotel_name',
                align: 'center',
                render:()=>( <p style={{margin:5}}>{this.state.hotelName}</p>)
            },
            {
                title: '位置',
                key: 'hotel_Location',
                align: 'center',
                render:()=>(<p style={{margin:5}}>{this.state.hotelLocation}</p>)
            },
            {
                title: '房型',
                dataIndex: 'roomClass',
                key: 'roomClass',
                align: 'center',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                precision: 0,
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.score - b.score,
                render:(record)=>(<p style={{margin:5}}>{record.toFixed(1)}</p>)
            },
            {
                title:'',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                render:(text, record, index)=>(<Button type="default" onClick={()=>{this.bookRoom(record)}}>预定</Button>)
            }
        ];

        const comments = [
            {
                title: '用户',
                dataIndex: 'customerId',
                key: 'customer_id',
                align: 'center',
            },
            {
                title: '评论',
                dataIndex: 'content',
                key: 'content',
                align: 'center',
            },
            {
                title: '评分',
                dataIndex: 'score',
                key: 'score',
                align: 'center',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.score - b.score,
            },
        ];
        const discount = [
            {
                title: '酒店名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getHotelName(record)}</p>)
            },
            {
                title: '位置',
                dataIndex: 'location',
                key: 'location',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getHotelLocation(record)}</p>)
            },
            {
                title:'星级',
                dataIndex: 'star',
                key: 'star',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getHotelStar(record)}</p>)
            },
            {
                title:'折扣力度/折',
                dataIndex: 'discountFactor',
                key: 'discountFactor',
                align: 'center',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.discountFactor - b.discountFactor,
                render:(record)=>(<p style={{margin:5}}>{(record * 10).toFixed(1)}</p>)
            },
            {
                title:'',
                dataIndex: 'serviceId',
                key: 'serviceId',
                align: 'center',
                width: 200,
                render:(text,record)=>(
                    <space size="large">
                        <Button type="default" onClick={()=>{this.selectDiscount(record)}}>订房间</Button>
                        <Button type="default" onClick={()=>{this.viewDiscountComment(record)}}>看评价</Button>
                    </space>
                )
            }
        ];

        if(this.state.form === 0){
            return (
                <Layout>
                    <Header/>
                    <div style={{backgroundColor:"white"}}>
                        <div>
                            <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 900,
                                    }}
                                >
                                    <Row justify="center">
                                        <Space direction="vertical" size={12} wrap>
                                            <Row justify="center">
                                                <Form
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 14 }}
                                                    layout="horizontal"
                                                    size="large"
                                                    style={{ maxWidth: 600 }}
                                                >
                                                    <Row justify="center">
                                                        <Space>
                                                            <RangePicker
                                                                size="large"
                                                                style={{ width: 300 }}
                                                                onChange={this.selectDate}
                                                            />
                                                            <Select
                                                                defaultValue="所有星级"
                                                                size="large"
                                                                style={{
                                                                    width: 110,
                                                                }}
                                                                onSelect={this.selectStar}
                                                                options={[
                                                                    {
                                                                        value: 0,
                                                                        label: '所有星级',
                                                                    },
                                                                    {
                                                                        value: 5,
                                                                        label: '五星',
                                                                    },
                                                                    {
                                                                        value: 4,
                                                                        label: '四星',
                                                                    },
                                                                    {
                                                                        value: 3,
                                                                        label: '三星',
                                                                    },
                                                                    {
                                                                        value: 2,
                                                                        label: '二星',
                                                                    },
                                                                    {
                                                                        value: 1,
                                                                        label: '一星',
                                                                    },
                                                                ]}
                                                            />
                                                            <Search placeholder="酒店名"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchName}/>
                                                            <Search placeholder="目的地"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchLocation}/>
                                                        </Space>
                                                    </Row>
                                                </Form>
                                            </Row>
                                        </Space>
                                    </Row>
                                </Card>
                            </Row>
                            <div>
                                <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Button type="default" style={{marginBottom:10,marginLeft:10,}} onClick={this.goDiscount}>特价酒店</Button>
                                        <Table
                                            dataSource={this.state.data}
                                            columns={columns}
                                            pagination={{
                                                pageSize: 15,
                                                defaultCurrent: 1,
                                            }}
                                        />
                                    </Card>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        else if(this.state.form === 1){
            return (
                <Layout>
                    <Header/>
                    <div style={{backgroundColor:"white"}}>
                        <div>
                            <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 900,
                                    }}
                                >
                                    <Row justify="center">
                                        <Space direction="vertical" size={12} wrap>
                                            <Row justify="center">
                                                <Form
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 14 }}
                                                    layout="horizontal"
                                                    size="large"
                                                    style={{ maxWidth: 600 }}
                                                >
                                                    <Row justify="center">
                                                        <Space>
                                                            <RangePicker
                                                                size="large"
                                                                style={{ width: 300 }}
                                                                onChange={this.selectDate}
                                                            />
                                                            <Select
                                                                defaultValue="所有星级"
                                                                size="large"
                                                                style={{
                                                                    width: 90,
                                                                }}
                                                                onSelect={this.selectStar}
                                                                options={[
                                                                    {
                                                                        value: 0,
                                                                        label: '所有星级',
                                                                    },
                                                                    {
                                                                        value: 5,
                                                                        label: '五星',
                                                                    },
                                                                    {
                                                                        value: 4,
                                                                        label: '四星',
                                                                    },
                                                                    {
                                                                        value: 3,
                                                                        label: '三星',
                                                                    },
                                                                    {
                                                                        value: 2,
                                                                        label: '二星',
                                                                    },
                                                                    {
                                                                        value: 1,
                                                                        label: '一星',
                                                                    },
                                                                ]}
                                                            />
                                                            <Search placeholder="酒店名"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchName}/>
                                                            <Search placeholder="目的地"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchLocation}/>
                                                        </Space>
                                                    </Row>
                                                </Form>
                                            </Row>
                                        </Space>
                                    </Row>
                                </Card>
                            </Row>
                            <div>
                                <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Button type="link" style={{marginBottom:10}} onClick={this.goBack}>返回</Button>
                                        <Table
                                            dataSource={this.state.roomData}
                                            columns={roomColumns}
                                            pagination={{
                                                pageSize: 15,
                                                defaultCurrent: 1,
                                            }}
                                        />
                                    </Card>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        else if(this.state.form === 3){
            return (
                <Layout>
                    <Header/>
                    <div style={{backgroundColor:"white"}}>
                        <div>
                            <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 900,
                                    }}
                                >
                                    <Row justify="center">
                                        <Space direction="vertical" size={12} wrap>
                                            <Row justify="center">
                                                <Form
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 14 }}
                                                    layout="horizontal"
                                                    size="large"
                                                    style={{ maxWidth: 600 }}
                                                >
                                                    <Row justify="center">
                                                        <Space>
                                                            <RangePicker
                                                                size="large"
                                                                style={{ width: 300 }}
                                                                onChange={this.selectDate}
                                                            />
                                                            <Select
                                                                defaultValue="所有星级"
                                                                size="large"
                                                                style={{
                                                                    width: 90,
                                                                }}
                                                                onSelect={this.selectStar}
                                                                options={[
                                                                    {
                                                                        value: 0,
                                                                        label: '所有星级',
                                                                    },
                                                                    {
                                                                        value: 5,
                                                                        label: '五星',
                                                                    },
                                                                    {
                                                                        value: 4,
                                                                        label: '四星',
                                                                    },
                                                                    {
                                                                        value: 3,
                                                                        label: '三星',
                                                                    },
                                                                    {
                                                                        value: 2,
                                                                        label: '二星',
                                                                    },
                                                                    {
                                                                        value: 1,
                                                                        label: '一星',
                                                                    },
                                                                ]}
                                                            />
                                                            <Search placeholder="酒店名"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchName}/>
                                                            <Search placeholder="目的地"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchLocation}/>
                                                        </Space>
                                                    </Row>
                                                </Form>
                                            </Row>
                                        </Space>
                                    </Row>
                                </Card>
                            </Row>
                            <div>
                                <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Space>
                                            <Button type="link" style={{marginBottom:10}} onClick={this.goBack}>返回</Button>
                                            <Button type="link" style={{marginBottom:10}} onClick={()=>(this.setState({visible: true}))}>我要评</Button>
                                        </Space>

                                        <Modal visible={this.state.visible}
                                               onOk={this.handleOk}
                                               onCancel={this.handleCancel}
                                               footer={null}
                                        >
                                            <Form className="评分"
                                                  onFinish={this.handleFinish}
                                                  ref={this.formRef}
                                            >
                                                <Space size="large">
                                                <Form.Item
                                                    name="score"
                                                    label="打分"
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                    style={{marginTop:20}}
                                                >
                                                    <InputNumber
                                                        style={{width: 150}}
                                                        min={0} max= {100}
                                                        size="large"
                                                        tyle={{
                                                            display: 'inline-block',
                                                    }}/>
                                                </Form.Item>
                                                </Space>
                                                <Form.Item
                                                    name="comment"
                                                    label="评论"
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                >
                                                    <Input style={{width: 350}} size="large"/>
                                                </Form.Item>
                                                <Form.Item
                                                    rules={[
                                                        {
                                                            required: false,
                                                        },
                                                    ]}
                                                >
                                                    <Row justify="center">
                                                    <Button size="large"
                                                            onClick={this.handleComment}
                                                            style={{
                                                                display: 'inline-block',
                                                            }}>
                                                        提交
                                                    </Button>
                                                    </Row>
                                                </Form.Item>
                                            </Form>
                                        </Modal>
                                        <Table
                                            dataSource={this.state.comment}
                                            columns={comments}
                                            pagination={{
                                                pageSize: 15,
                                                defaultCurrent: 1,
                                            }}
                                        />
                                    </Card>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        else if(this.state.form === 2){
            return (
                <Layout>
                    <Header/>
                    <div style={{backgroundColor:"white"}}>
                        <div>
                            <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 900,
                                    }}
                                >
                                    <Row justify="center">
                                        <Space direction="vertical" size={12} wrap>
                                            <Row justify="center">
                                                <Form
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 14 }}
                                                    layout="horizontal"
                                                    size="large"
                                                    style={{ maxWidth: 600 }}
                                                >
                                                    <Row justify="center">
                                                        <Space>
                                                            <RangePicker
                                                                size="large"
                                                                style={{ width: 300 }}
                                                                onChange={this.selectDate}
                                                            />
                                                            <Select
                                                                defaultValue="所有星级"
                                                                size="large"
                                                                style={{
                                                                    width: 90,
                                                                }}
                                                                onSelect={this.selectStar}
                                                                options={[
                                                                    {
                                                                        value: 0,
                                                                        label: '所有星级',
                                                                    },
                                                                    {
                                                                        value: 5,
                                                                        label: '五星',
                                                                    },
                                                                    {
                                                                        value: 4,
                                                                        label: '四星',
                                                                    },
                                                                    {
                                                                        value: 3,
                                                                        label: '三星',
                                                                    },
                                                                    {
                                                                        value: 2,
                                                                        label: '二星',
                                                                    },
                                                                    {
                                                                        value: 1,
                                                                        label: '一星',
                                                                    },
                                                                ]}
                                                            />
                                                            <Search placeholder="酒店名"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchName}/>
                                                            <Search placeholder="目的地"
                                                                    size="large"
                                                                    style={{width: 150}}
                                                                    onSearch={this.searchLocation}/>
                                                        </Space>
                                                    </Row>
                                                </Form>
                                            </Row>
                                        </Space>
                                    </Row>
                                </Card>
                            </Row>
                            <div>
                                <Row justify="center" style={{marginTop:30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Row justify="center" >
                                            <Space>
                                                <p style={{fontSize: '30px'}}>特价酒店</p>
                                            </Space>
                                        </Row>
                                        <Table
                                            dataSource={this.state.discountData}
                                            columns={discount}
                                            pagination={{
                                                pageSize: 8,
                                                defaultCurrent: 1,
                                            }}
                                        />
                                    </Card>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Layout>
            )
        }
        else if(this.state.form === 4){
            return(
            <Layout>
                <Header/>
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh',}}>
                        <Card 
                            className="text-center"
                            title = "订单信息"
                            bordered={false}
                            style={{
                            width: 300,
                            }}
                        >
                            <div>
                                <div>
                                {/* <p>Room_id:0405</p> */}
                                <p>酒店号:{this.state.hotelId}</p>
                                <p>房间号:{this.state.recordId}</p>
                                <p>入住时间:{formatDate(this.state.startdate)}</p>
                                <p>截止时间:{formatDate(this.state.enddate)}</p> 
                                {/* <p>Room_Class:King</p> */}
                                {/* <p>Customer_id:{data.customer_id}</p> */}
                                <p>价格:{this.state.recordPrice}</p>
                                </div>
                            </div>
                        <div>
                            <p>请输入支付密码</p>
                        </div>
                        <div>
                            <Input placeholder="Basic usage" type={"password"} value={this.state.inputpassword} onChange={(e)=>this.inputpasswordChange(e)} />
                        </div>
                        <Button type="primary" onClick={this.handleButtonClick}>
                            yes
                        </Button>
                        <Button type="secondary" onClick={this.handleButtonCancel}>
                            no
                        </Button>
                        </Card>
                    </div>   
            </Layout>)       
        }
    }
}