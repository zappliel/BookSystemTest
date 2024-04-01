import React from 'react';
import {MDBBadge, MDBTable, MDBTableHead, MDBTableBody, MDBCardTitle, MDBCard} from 'mdb-react-ui-kit';
import {LineChart, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend} from "recharts";


export default function MyLinechart1({data}) {
    console.log(data[0]["totalExpense"]);
    console.log(data[0]["month"]);
    return (
        <MDBCard className='my-5 bg-glass'>
            <MDBCardTitle className='h1'>月度统计支出</MDBCardTitle>
            <div>
                <LineChart width={500} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey= "yearMonth"/>
                    {/*<YAxis yAxisId="balanceChange" dataKey="balanceChange"/>*/}
                    <YAxis yAxisId="mainY"/>
                    {/*<YAxis yAxisId="totalIncome"  dataKey="totalIncome" orientation= 'totalExpense'/>*/}
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="balanceChange" name="余额变化" stroke="#8884d8" yAxisId='mainY'/>
                    <Line type="monotone" dataKey="totalExpense" name="总支出" stroke="#0084d8" yAxisId="mainY"/>
                    <Line type="monotone" dataKey="totalIncome" name="总收入" stroke="#8800d8" yAxisId="mainY"/>
                </LineChart>
            </div>

        </MDBCard>
    );
}
