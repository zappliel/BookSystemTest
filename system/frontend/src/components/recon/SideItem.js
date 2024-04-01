import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import '../App.css'

const NavItem = styled.li`
    height: 50px;
    padding: 40px;
`;

export default class SideItem extends React.Component{

    render(){
        const {to, name} = this.props
        return(
            <div>
                <NavLink className={({isActive})=>{return isActive?'myActive':'notActive'}} to={to}>
                    {name}
                </NavLink>
            </div>
        )
    }
}