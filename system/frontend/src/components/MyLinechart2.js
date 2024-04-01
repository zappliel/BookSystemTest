import React from 'react';
import {MDBBadge, MDBTable, MDBTableHead, MDBTableBody, MDBCardTitle, MDBCard} from 'mdb-react-ui-kit';
import {LineChart, Line, XAxis, YAxis, CartesianAxis, CartesianGrid, Tooltip, Legend} from "recharts";


export default function MyLinechart2({data}) {

    const yearlyData = new Map();
    data.forEach((elem) => {
        const year = elem.year;
        const expense = elem.balanceChange;

        if (yearlyData.has(year)) {
            const currTotal = yearlyData.get(year);
            yearlyData.set(year, currTotal + expense);
        } else {
            yearlyData.set(year, expense);
        }
    });
    const yearlyDataArray = Array.from(yearlyData).map(([year, totalExpense]) => ({
        year: `${year}`,
        totalExpense: totalExpense,
    }));

    return (
        <MDBCard className='my-5 bg-glass'>
            <MDBCardTitle className='h1'>年度余额变化统计</MDBCardTitle>
            <div>
                <LineChart width={500} height={300} data={yearlyDataArray}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="year"/>
                    {/*<YAxis yAxisId="balanceChange" dataKey="balanceChange"/>*/}
                    <YAxis yAxisId="mainY"/>
                    {/*<YAxis yAxisId="totalIncome"  dataKey="totalIncome" orientation= 'totalExpense'/>*/}
                    <Tooltip/>
                    <Legend/>
                    {/*<Line type="monotone" dataKey="year" name="" stroke="#8884d8" yAxisId='mainY'/>*/}
                    <Line type="monotone" dataKey="totalExpense" name="年度余额变化统计" stroke="#0084d8" yAxisId="mainY"/>
                    {/*<Line type="monotone" dataKey="totalIncome" name="总收入" stroke="#8800d8" yAxisId="mainY"/>*/}
                </LineChart>
            </div>

        </MDBCard>
    );
}
