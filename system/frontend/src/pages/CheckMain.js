import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  MDBContainer,
  MDBBtn,
  MDBInputGroup,
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody, 
  MDBDropdown, 
  MDBDropdownToggle, 
  MDBDropdownMenu, 
  MDBDropdownItem
}
  from 'mdb-react-ui-kit';

import Footer from '../components/recon/Footer';
import MyTable from '../components/recon/MyTable';
import CheckHeader from '../components/recon/CheckHeader';
import EditButton from '../components/recon/EditButton';
import axios from 'axios';
import { backendPort } from '../global/global';

class CheckMain extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      searchOrder: '',
      placeholder: '查询订单号',
      orders: [],  // 存储订单信息的字典数组
      searchedOrder: '', //当前搜索的订单号
      searchResult: null,
      pagetoken: localStorage.getItem('Token') || '', // 初始化pagetoken并获取Token的值
      exceptionCount:1,
      selectedDate: new Date(), // 默认选择当前日期
      normalnum:0,
      abnormalnum:0,
      attentionnum:0,
      totalnum:0
    };
  }

    // 根据datepicker来获取对应日期的对账数据列表
    fetchReconciliationData = (formattedDate) => {
      const Token = localStorage.getItem('Token');
      console.log(Token);
      axios.post(`http://${backendPort}/api/v1/reconciliation/reconcile?date=${encodeURIComponent(formattedDate)}`, null,{
        headers: {
          'Authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json'
        }
      })
          .then(response => {
            // 在这里处理从后端获取到的数据
            const result = response.data;
            console.log(result);
            this.setState({orders: result.data, searchResult: result.data, searchedOrder:'', searchOrder:'', 
            normalnum:result.normal_num, abnormalnum:result.abnormal_num, attentionnum:result.attention_num, totalnum:result.total_num});
            console.log("返回数据：");
            console.log(result.data);
            console.log(result.total_num);
            console.log(result.normal_num);
            console.log(result.abnormal_num);
            console.log(result.attention_num);
          })
          .catch(error => {
            // 处理请求错误
            console.error(error);
          });
    }
  

   // 获取前一天对账列表的回调函数
   handleGetPreviousDayListClick = () => {
    // 在这里调用后端接口获取订单信息并更新state中的orders
    //例如：const previousDayOrders = fetchPreviousDayList(); 假设fetchPreviousDayList是获取前一天订单信息的函数
    const formattedDate = this.formatDate(this.state.selectedDate); // 格式化所选日期
    // this.fetchPreviousDayList();
    this.fetchReconciliationData(formattedDate);
  };

  // 获取前一天的对账数据列表
  fetchPreviousDayList = () => {
    const Token = localStorage.getItem('Token');
    console.log(Token);
    axios.post(`http://${backendPort}/api/v1/reconciliation/reconcile`, null,{
      headers: {
        'Authorization': `Bearer ${Token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(response => {
          // 在这里处理从后端获取到的数据
          const data = response.data;
          console.log(data);
          this.setState({orders: data, searchResult: data, searchedOrder:'', searchOrder:''})
          console.log(this.state)
        })
        .catch(error => {
          // 处理请求错误
          console.error(error);
        });
  }

  // 格式化日期函数
  formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 根据datepicker来设置日期
  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  // 处理订单号输入变化的回调函数
  handleSearchChange = (e) => {
    this.setState({ searchOrder: e.target.value });
  };

  // 处理搜索订单号按钮点击的回调函数
  handleSearchOrderIDClick = () => {
    const { searchOrder, orders } = this.state;
    const searchedOrder = searchOrder.trim();
    // 在这里根据searchOrder的值筛选表单中的数据
    // 使用筛选后的数据进行相关操作
    if (searchedOrder === '') {
      // 如果搜索订单号为空，则重置搜索结果
      this.setState({ searchedOrder: '', searchResult: this.state.orders, placeholder: '查询订单号' });
    } else {
      // 在订单列表中查找匹配的订单
      console.log(Number(searchOrder));
      const result = orders.find(order => order.order_id === Number(searchedOrder));
      console.log(orders);
      console.log(result===undefined ? null : result);
      // 更新搜索结果
      this.setState({ searchedOrder, searchResult : result===undefined ? null: result, placeholder: '查询订单号'});
      console.log(this.state);
    }
  };

  // 处理搜索买家ID按钮点击的回调函数
  handleSearcBuyerIDClick = () => {
    const { searchOrder, orders } = this.state;
    const searchedOrder = searchOrder.trim();
    // 在这里根据searchOrder的值筛选表单中的数据
    // 使用筛选后的数据进行相关操作
    if (searchedOrder === '') {
      // 如果搜索订单号为空，则重置搜索结果
      this.setState({ searchedOrder: '', searchResult: this.state.orders, placeholder: '查询买家ID' });
    } else {
      // 在订单列表中查找匹配的订单
      console.log(Number(searchOrder));
      const result = orders.find(order => order.buyer_id === Number(searchedOrder));
      console.log(orders);
      console.log(result===undefined ? null : result);
      // 更新搜索结果
      this.setState({ searchedOrder, searchResult : result===undefined ? null: result, placeholder: '查询买家ID'});
      console.log(this.state);
    }
  };

  // 处理搜索卖家ID按钮点击的回调函数
  handleSearcSellerIDClick = () => {
    const { searchOrder, orders } = this.state;
    const searchedOrder = searchOrder.trim();
    // 在这里根据searchOrder的值筛选表单中的数据
    // 使用筛选后的数据进行相关操作
    if (searchedOrder === '') {
      // 如果搜索订单号为空，则重置搜索结果
      this.setState({ searchedOrder: '', searchResult: this.state.orders, placeholder: '查询卖家ID' });
    } else {
      // 在订单列表中查找匹配的订单
      console.log(Number(searchOrder));
      const result = orders.find(order => order.seller_id === Number(searchedOrder));
      console.log(orders);
      console.log(result===undefined ? null : result);
      // 更新搜索结果
      this.setState({ searchedOrder, searchResult : result===undefined ? null: result, placeholder: '查询卖家ID'});
      console.log(this.state);
    }
  };

  // 处理搜索买家用户名的回调函数
  handleSearchBuyerNameClick = () => {
    const { searchOrder, orders } = this.state;
    const searchedOrder = searchOrder.trim();

    if (searchedOrder === '') {
      // 如果搜索关键字为空，则重置搜索结果
      this.setState({ searchedOrder: '', searchResult: this.state.orders, placeholder: '查询买家用户名' });
    } else {
      // 在订单列表中查找匹配的订单
      const result = orders.filter(order =>
        order.buyer_name.toLowerCase().includes(searchedOrder.toLowerCase())
      );

      // 更新搜索结果
      this.setState({ searchedOrder, searchResult: result, placeholder: '查询买家用户名' });
    }
  };

  // 处理搜索买家用户名的回调函数
  handleSearchBuyerNameClick = () => {
    const { searchOrder, orders } = this.state;
    const searchedOrder = searchOrder.trim();

    if (searchedOrder === '') {
      // 如果搜索关键字为空，则重置搜索结果
      this.setState({ searchedOrder: '', searchResult: this.state.orders, placeholder: '查询买家用户名' });
    } else {
      // 在订单列表中查找匹配的订单
      const result = orders.filter(order =>
        order.seller_name.toLowerCase().includes(searchedOrder.toLowerCase())
      );

      // 更新搜索结果
      this.setState({ searchedOrder, searchResult: result, placeholder: '查询买家用户名' });
    }
  };

  // 一键获取异常订单和疑误订单
  handleCheckExceptionalOrdersClick = () => {
    const {  searchResult, orders } = this.state;
  
    if (orders === '') {
      // If the search order is empty, reset the search result to all orders
      this.setState({ searchedOrder: '', searchResult: null });
    } else {
      // Filter the search result based on the order state and update the state accordingly
      const exceptionalOrders = searchResult.filter(order => order.state === 1 || order.state === 2);
      this.setState({ searchResult: exceptionalOrders});
    }
  };
  

  render() {
    const { searchOrder, orders, searchResult, pagetoken } = this.state;
    if (pagetoken  === '') {
      // 如果new_token为空，则重定向到404页面
      return (
          <div>
              <h1>Page not found.</h1>
          </div>
      );
    }else{
      return (
          <div style={{display:'flex',justifyItems:'center',flexDirection:'column'}}>
            {/* <CheckHeader exceptionCount={this.state.exceptionCount}/> */}
            <CheckHeader number={this.state.abnormalnum+this.state.attentionnum} orders={searchResult}/>
            <MDBContainer style={{ boxShadow: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', top: '80px', left: '80px' }} className="my-5">
              <span className="flex-grow-1" >
                <MDBInputGroup className='d-flex w-auto mb-3' style={{ justifyContent: 'space-between', height: '40px' }}>
                  <MDBBtn onClick={this.handleGetPreviousDayListClick} style={{ height: '100%' }}>获取对账列表</MDBBtn>
                  <div style={{ marginRight: '20px' , display: 'flex',justifyContent: 'space-between'}}></div>
                  <div className="search-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <DatePicker
                      selected={this.state.selectedDate} // 将默认选择日期设置为当前日期
                      onChange={this.handleDateChange} // 处理日期选择更改
                      dateFormat="yyyy-MM-dd" // 定义日期格式
                      style={{ height: '100%' }}
                      className="form-control"
                    />
                    <input
                      className='form-control'
                      placeholder={this.state.placeholder}
                      aria-label="Search"
                      type='Search'
                      id='ordersearch'
                      value={searchOrder}
                      onChange={this.handleSearchChange}
                      style={{ height: '100%', marginLeft: '20px' }}
                    />
                    {/* <MDBBtn onClick={this.handleSearchClick}>Search</MDBBtn> */}
                    <MDBDropdown style={{ width: '100%' }}>
                      <MDBDropdownToggle color='primary' caret>
                        搜索选项
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem onClick={this.handleSearchOrderIDClick}>
                          搜索订单号
                        </MDBDropdownItem>
                        <MDBDropdownItem divider />
                        <MDBDropdownItem onClick={this.handleSearcBuyerIDClick}>
                          搜索买家ID
                        </MDBDropdownItem>
                        <MDBDropdownItem divider />
                        <MDBDropdownItem onClick={this.handleSearcSellerIDClick}>
                          搜索卖家ID
                        </MDBDropdownItem>
                        <MDBDropdownItem divider />
                        {/* <MDBDropdownItem onClick={this.handleSearchBuyerNameClick}>
                          搜索买家用户名
                        </MDBDropdownItem>
                        <MDBDropdownItem divider />
                        <MDBDropdownItem onClick={this.handleSearchSellerNameClick}>
                          搜索卖家用户名
                        </MDBDropdownItem>
                        <MDBDropdownItem divider /> */}
                      </MDBDropdownMenu>
                    </MDBDropdown>
                    <MDBBtn onClick={this.handleCheckExceptionalOrdersClick} style={{ width: '100%' }}>一键查询异常&疑误订单</MDBBtn>
                  </div>
                </MDBInputGroup>
              </span>

              <div style={{ width: '100%' }}>
                {this.state.searchResult && this.state.searchedOrder !== '' ? (
                  <div>
                    <MDBTable align='middle'>
                      <MDBTableHead>
                        <tr>
                          <th scope='col'>订单号</th>
                          <th scope='col'>买家ID</th>
                          <th scope='col'>买家用户名</th>
                          <th scope='col'>卖家ID</th>
                          <th scope='col'>卖家用户名</th>
                          <th scope='col'>异常状态</th>
                          <th scope='col'>操作</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        <tr>
                          <td>
                            <div className='d-flex align-items-center'>
                              <p>{this.state.searchResult.order_id}</p>
                            </div>
                          </td>
                          <td>
                            <p>{this.state.searchResult.buyer_id}</p>
                          </td>
                          <td>
                            <p>{this.state.searchResult.buyer_name}</p>
                          </td>
                          <td>
                            <p>{this.state.searchResult.seller_id}</p>
                          </td>
                          <td>
                            <p>{this.state.searchResult.seller_name}</p>
                          </td>
                          <td>
                            <MDBBadge color={this.state.searchResult.state === 0 ? 'info' : this.state.searchResult.state === 1 ? 'danger' : 'warning'} pill>
                              {this.state.searchResult.state === 0 ? "Normal" : this.state.searchResult.state === 1 ? "Abnormal" : "Warning"}
                            </MDBBadge>

                          </td>
                          <td>
                            <EditButton order_id={this.state.searchResult.order_id} />
                          </td>
                        </tr>
                      </MDBTableBody>
                    </MDBTable>
                  </div>
                ) : (
                  <MyTable orders={searchResult} />
                )}
              </div>
              {/* 添加空行 */}
              <div style={{ marginTop: '40px' }}></div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', marginRight: '10px' }}>总订单数量:</span>
                    <MDBBadge color="success" pill style={{ fontSize: '16px' }}>{this.state.totalnum}</MDBBadge>
                  </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', marginRight: '10px' }}>正常订单数量:</span>
                  <MDBBadge color="info" pill style={{ fontSize: '16px' }}>{this.state.normalnum}</MDBBadge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', marginRight: '10px' }}>异常订单数量:</span>
                  <MDBBadge color="danger" pill style={{ fontSize: '16px' }}>{this.state.abnormalnum}</MDBBadge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', marginRight: '10px' }}>疑误订单数量:</span>
                  <MDBBadge color="warning" pill style={{ fontSize: '16px' }}>{this.state.attentionnum}</MDBBadge>
                </div>
              </div>

            </MDBContainer>

          </div>
      );
    }
  }



}

export default CheckMain;
