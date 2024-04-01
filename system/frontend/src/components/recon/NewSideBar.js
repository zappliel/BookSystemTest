import React from 'react';
import { Navbar, Nav, NavLink, Container} from 'react-bootstrap';
import './NewSideBar.css'
import { Link } from 'react-router-dom';

export default class NewSideBar extends React.Component {
    render(){
        const {order_id} = this.props;
        console.log("sidebar", order_id);
        return(
            <div>
                <Nav className="sidebar">
                    <Nav.Item>
                        <Nav.Link as={Link} to={`/Deal`} state={{order_id:order_id}}>交易信息</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to={`/Seller`} state={{order_id:order_id}}>卖家信息</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to={`/Buyer`} state={{order_id:order_id}}>买家信息</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        );
    }
}
