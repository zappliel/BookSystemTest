import React from 'react';
import { Navigate, useNavigate, Link } from "react-router-dom"; 
import { MDBBtn } from 'mdb-react-ui-kit';
import { useHistory,useLocation } from 'react-router-dom';

export default class EditButton extends React.Component{
  
  handleClick = (order_id) => {
      console.log(order_id);
  };

  render(){
    const {order_id} = this.props;
    console.log(this.props);
    return (
      <MDBBtn color='link' rounded size='sm' onClick={() => this.handleClick(order_id)}>
        <Link to = {`/CheckOrder/${order_id}`}>
        {/*state={{
          ooderNumber: orderInfo.order_id,
          sellerID: orderInfo.sellerID,
          buyerID: orderInfo.buyerID,
          status: orderInfo.status,
          product: orderInfo.product,
          amount: orderInfo.amount,
          time: orderInfo.time
        }}*/}
         Check&Edit 
         </Link>
      </MDBBtn>
    );
  }
};