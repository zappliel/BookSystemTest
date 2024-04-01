import axios from 'axios';
import React from 'react';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Qs from 'qs'
import moment from "moment";
import {
    Button,
    DatePicker,
    Space,
    Table,
    Tag,
    Input,
    Row,
    Col,
    Divider,
    Select,
    Card,
    Layout,
    Form,
    theme,
    Tooltip,
    Descriptions,
    Badge,
    List, Modal, InputNumber
} from 'antd';

const { RangePicker } = DatePicker;

const { Meta } = Card;

const  { Search } = Input;
function formatStartDate(value) {
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
function formatEndDate(value) {
    var date = new Date(value + 86400000);
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
export default class FlightSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            comment: [],
            allData: [],
            discountData: [],
            from: "",
            to: "",
            date: 0,
            flightId: 0,
            form: 2,
            preform: 0,
            _score: 0,
            _comment: "",
            visible: false,
        }
    }


    formRef = React.createRef();
    handleComment = () => {
        this.setState({visible:false})
        this.postComment()
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    onFinish = () => {
        console.log("from=", this.state.from, "to=", this.state.to, "date=", this.state.date)
    }
    onSearch = () => {
        console.log(this.state.from,this.state.to,this.state.date)
        this.setState({preform:this.state.form,form: 0})
        this.setState({from: this.formRef.current.getFieldsValue("from").from})
        this.setState({to: this.formRef.current.getFieldsValue("from").to})
        this.setState({date: this.formRef.current.getFieldsValue("from").date})
        const params = {
            from: this.formRef.current.getFieldsValue("from").from,
            to: this.formRef.current.getFieldsValue("from").to,
            minDate: formatStartDate(this.formRef.current.getFieldsValue("from").date),
            maxDate: formatEndDate(this.formRef.current.getFieldsValue("from").date),
        }
        axios.get('http://localhost:8080/flight/query', {
            params
        }).then((res) => {
            console.log(res)
            this.setState({data: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    selectFlight = (value) => {
        this.setState({flightId: value.id})
        console.log(value.id)
    }
    goBack = () =>{
        this.setState({form:this.state.preform})
    }
    goDiscount = () =>{
        this.loadDiscount()
        this.setState({preform:this.state.form,form: 2})
    }
    viewComment = (value) => {
        this.setState({flightId: value.id, preform:this.state.form,form: 3})
        const params = {
            serviceId: value.id,
            type: "FLIGHT",
        }
        axios.get('http://localhost:8080/comment/query', {
            params
        }).then((res) => {
            console.log(res)
            this.setState({comment: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    getFrom = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return item.from
            }
        })
    }
    getTo = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return item.to;
            }
        })
    }
    getDTime = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return moment(item.departureTime).format('YYYY-MM-DD HH:mm');
            }
        })
    }
    getATime = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return moment(item.arrivalTime).format('YYYY-MM-DD HH:mm');
            }
        })
    }
    getPrice = (record) => {
        return this.state.allData.map((item,index) => {
            if(item.id === record.serviceId){
                return item.price;
            }
        })
    }
    loadFlight = () => {
        const params = {
            from: this.state.from,
            to: this.state.to,
            minDate: formatStartDate(this.state.date),
            maxDate: formatEndDate(this.state.date),
        }
        axios.get('http://localhost:8080/flight/query', {
            params
        }).then((res) => {
            console.log(res)
            this.setState({data: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadComment = () => {
        const params = {
            serviceId: this.state.flightId,
            type: "FLIGHT",
        }
        axios.get('http://localhost:8080/comment/query', {
            params
        }).then((res) => {
            console.log(res)
            this.setState({comment: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadDiscount = () => {
        const params = {
            type: "FLIGHT",
        }
        axios.get('http://localhost:8080/discount/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({discountData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    loadAll = () => {
        const params = {
        }
        axios.get('http://localhost:8080/flight/query', {
            params
        }).then((res ) => {
            console.log(res)
            this.setState({allData: res.data});
        }).catch(err => {
            console.log(err);
        });
    }
    postComment = () => {
        const data = {
            "customerId": 1000000,
            "serviceId": this.state.flightId,
            "type": "FLIGHT",
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
        }).catch(function (error) {
            console.log(error);
        });
    }
    componentDidMount() {
        this.loadAll()
        this.loadFlight()
        this.loadDiscount()
    }


    render() {
        const columns = [
            {
                title: '出发地',
                dataIndex: 'from',
                key: 'from',
                align: 'center',
            },
            {
                title: '目的地',
                dataIndex: 'to',
                key: 'to',
                align: 'center',
            },
            {
                title: '出发时间',
                dataIndex: 'departureTime',
                key: 'departureTime',
                align: 'center',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>
            },
            {
                title: '到达时间',
                dataIndex: 'arrivalTime',
                key: 'arrivalTime',
                align: 'center',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.price - b.price,
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
                title: '',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                render: (text, record) => (
                    <space size="large">
                        <Button type="default" style={{width:70}} onClick={() => {
                            this.selectFlight(record)
                        }}>订票</Button>
                        <Button type="default" style={{width:70}} onClick={() => {
                            this.viewComment(record)
                        }}>看评价</Button>
                    </space>
                )
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
                title: '出发地',
                dataIndex: 'from',
                key: 'from',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getFrom(record)}</p>)
            },
            {
                title: '目的地',
                dataIndex: 'to',
                key: 'to',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getTo(record)}</p>)
            },
            {
                title: '出发时间',
                dataIndex: 'departureTime',
                key: 'arrivalTime',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getDTime(record)}</p>)
            },
            {
                title: '到达时间',
                dataIndex: 'arrivalTime',
                key: 'time_end',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getATime(record)}</p>)
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
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                render:(text,record)=>(<p style={{margin:5}}>{this.getPrice(record)}</p>)
            },
            {
                title: '',
                dataIndex: 'serviceId',
                key: 'serviceId',
                align: 'center',
                minWidth: 400,
                render: (text, record) => (
                    <space size="large">
                        <Button type="default" style={{width:70}} onClick={() => {
                            this.selectFlight(record)
                        }}>订票</Button>
                        <Button type="default" style={{width:70}} onClick={() => {
                            this.viewComment(record)
                        }}>看评价</Button>
                    </space>
                )
            }
        ];
        if (this.state.form === 0) {
            return (
                <Layout>
                    <div style={{backgroundColor: "white"}}>
                        <div>
                            <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 900,
                                    }}
                                >
                                    <Row justify="center">
                                        <Form
                                            style={{
                                                width: 600,
                                            }}
                                            size="large"
                                            onFinish={this.onFinish}
                                            ref={this.formRef}
                                        >
                                            <Row justify="center" style={{marginTop: 30}}>
                                                <Space size="middle">
                                                    <Form.Item
                                                        name="from"
                                                        rules={[
                                                            {
                                                                required: false,
                                                            },
                                                        ]}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <Input placeholder="出发地" style={{width: 150}} size="large"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="to"
                                                        rules={[
                                                            {
                                                                required: false,
                                                            },
                                                        ]}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <Input placeholder="目的地" style={{width: 150}} size="large"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="date"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            },
                                                        ]}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <DatePicker placeholder="出发日期" style={{width: 150}}
                                                                    size="large"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        style={{
                                                            display: 'inline-block',
                                                        }}>
                                                        <Button type="primary" style={{backgroundColor:'black'}} size="large" onClick={this.onSearch}>
                                                            搜索
                                                        </Button>
                                                    </Form.Item>
                                                </Space>
                                            </Row>
                                        </Form>
                                    </Row>
                                </Card>
                            </Row>
                        </div>
                        <div>
                            <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 1300,
                                    }}
                                >
                                    <div>
                                        <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                            <Card
                                                style={{
                                                    width: 900,
                                                }}
                                            >
                                                <Button type="default" style={{marginBottom:10,marginLeft:10,}} onClick={this.goDiscount}>看折扣机票</Button>
                                                <Table
                                                    dataSource={this.state.data}
                                                    columns={columns}
                                                    pagination={{
                                                        pageSize: 10,
                                                        defaultCurrent: 1,
                                                    }}
                                                />
                                            </Card>
                                        </Row>
                                    </div>
                                </Card>
                            </Row>
                        </div>
                    </div>
                </Layout>
            )
        } else if (this.state.form === 3) {
            return (
                <Layout>
                    <div style={{backgroundColor: "white"}}>
                        <div>
                            <div>
                                <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Row justify="center">
                                            <Form
                                                style={{
                                                    width: 600,
                                                }}
                                                size="large"
                                                onFinish={this.onFinish}
                                                ref={this.formRef}
                                            >
                                                <Row justify="center" style={{marginTop: 30}}>
                                                    <Space size="middle">
                                                        <Form.Item
                                                            name="from"
                                                            rules={[
                                                                {
                                                                    required: false,
                                                                },
                                                            ]}
                                                            style={{
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            <Input placeholder="出发地" style={{width: 150}} size="large"/>
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="to"
                                                            rules={[
                                                                {
                                                                    required: false,
                                                                },
                                                            ]}
                                                            style={{
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            <Input placeholder="目的地" style={{width: 150}} size="large"/>
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="date"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                },
                                                            ]}
                                                            style={{
                                                                display: 'inline-block',
                                                            }}
                                                        >
                                                            <DatePicker placeholder="出发日期" style={{width: 150}}
                                                                        size="large"/>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label=" "
                                                            colon={false}
                                                            style={{
                                                                display: 'inline-block',
                                                            }}>
                                                            <Button type="primary" style={{backgroundColor:'black'}} size="large" onClick={this.onSearch}>
                                                                搜索
                                                            </Button>
                                                        </Form.Item>
                                                    </Space>
                                                </Row>
                                            </Form>
                                        </Row>
                                    </Card>
                                </Row>
                            </div>
                            <div>
                                <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Space>
                                            <Button type="link" style={{marginBottom: 10}}
                                                    onClick={this.goBack}>返回</Button>
                                            <Button type="link" style={{marginBottom: 10}}
                                                    onClick={() => (this.setState({visible: true}))}>我要评</Button>
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
                                                        style={{marginTop: 20}}
                                                    >
                                                        <InputNumber
                                                            style={{width: 150}}
                                                            min={0} max={100}
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
                                                <Form.Item>
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
        } else if (this.state.form === 2) {
            return (
                <Layout>
                    <div style={{backgroundColor: "white"}}>
                        <div>
                            <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                <Card
                                    style={{
                                        width: 900,
                                    }}
                                >
                                    <Row justify="center">
                                        <Form
                                            style={{
                                                width: 600,
                                            }}
                                            size="large"
                                            onFinish={this.onFinish}
                                            ref={this.formRef}
                                        >
                                            <Row justify="center" style={{marginTop: 30}}>
                                                <Space size="middle">
                                                    <Form.Item
                                                        name="from"
                                                        rules={[
                                                            {
                                                                required: false,
                                                            },
                                                        ]}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <Input placeholder="出发地" style={{width: 150}} size="large"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="to"
                                                        rules={[
                                                            {
                                                                required: false,
                                                            },
                                                        ]}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <Input placeholder="目的地" style={{width: 150}} size="large"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="date"
                                                        rules={[
                                                            {
                                                                required: true,
                                                            },
                                                        ]}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <DatePicker placeholder="出发日期" style={{width: 150}}
                                                                    size="large"/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label=" "
                                                        colon={false}
                                                        style={{
                                                            display: 'inline-block',
                                                        }}>
                                                        <Button type="primary" style={{backgroundColor:'black'}} size="large" onClick={this.onSearch}>
                                                            搜索
                                                        </Button>
                                                    </Form.Item>
                                                </Space>
                                            </Row>
                                        </Form>
                                    </Row>
                                </Card>
                            </Row>
                            <div>
                                <Row justify="center" style={{marginTop: 30, marginBottom: 30}}>
                                    <Card
                                        style={{
                                            width: 900,
                                        }}
                                    >
                                        <Row justify="center" >
                                            <Space>
                                                <p style={{fontSize: '30px'}}>折扣机票</p>
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
    }
}