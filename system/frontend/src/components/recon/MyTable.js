import React, { useState } from 'react';
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import EditButton from './EditButton';

export default function MyTable({ orders }) {
    // 渲染订单信息
    const renderOrderInfo = () => {
        if (orders === null) {
            return (
                <tr>
                    <td colSpan='7'>没有订单信息</td>
                </tr>
            );
        }

        return orders.map((order, index) => (
            <tr key={index}>
                <td>
                    <div className='d-flex align-items-center'>
                        <p>{order.order_id}</p>
                    </div>
                </td>
                <td>
                    <p>{order.buyer_id}</p>
                </td>
                <td>
                    <p>{order.buyer_name}</p>
                </td>
                <td>
                    <p>{order.seller_id}</p>
                </td>
                <td>
                    <p>{order.seller_name}</p>
                </td>
                <td>
                    <MDBBadge color={order.state === 0 ? 'info' : order.state === 1 ? 'danger' : 'warning'} pill>
                            {order.state === 0 ? "Normal" : order.state === 1 ? "Abnormal" : "Warning"}
                        </MDBBadge>
                </td>
                <td>
                    <EditButton order_id={order.order_id}/>
                </td>
            </tr>
        ));
    };

    return (
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
                {renderOrderInfo()}
            </MDBTableBody>
        </MDBTable>
    );
}
