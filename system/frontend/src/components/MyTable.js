import React from 'react';
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody,MDBCardTitle,MDBCard     } from 'mdb-react-ui-kit';


export default function MyTable({ data }) {
    // 渲染订单信息
    /*for (let i = 0; i < data.length; i++) {

    }*/
    const renderOrderInfo = () => {
        if (data === null) {
            return (
                <tr>
                    <td>没有订单信息</td>
                </tr>
            );
        }
        //return <div><h4>有东西</h4></div>
        return data.map((data, index) => (

            <tr key={index}>
                <td>
                    <p className='fw-bold mb-1'>{data.year}</p>
                </td>
                <td>
                        <p className='fw-bold mb-1'>{data.month}</p>
                </td>
                {/*<td>*/}
                {/*    <p>{data.dateString}</p>*/}
                {/*</td>*/}
                <td>
                    <p>{data.balanceChange}</p>
                </td>
            </tr>
        ));
    };

    return (
        <MDBCard className='my-5 bg-glass'>
            <MDBCardTitle className='h1'>月度统计信息</MDBCardTitle>

        <MDBTable align='middle'>

            <MDBTableHead className="">
                <tr>
                    <th scope='col'>年份</th>
                    <th scope='col'>月份</th>
                    {/*<th scope='col'>时间</th>*/}
                    <th scope='col'>余额变化</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {renderOrderInfo()}
            </MDBTableBody>
        </MDBTable>
            </MDBCard>
    );
}
