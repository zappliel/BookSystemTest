import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import SideItem from "./SideItem";

const SidebarWrapper = styled.div`
    background-color: royalblue;
    height: 100vh; /* 使侧边栏高度占满整个视口 */
    top: 0;
    position: fixed;
    width: 200px;
`;

const NavWrapper = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;

const NavItem = styled.li`
    margin: 0;
    padding: 30px;
`;

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <NavWrapper>
        <SideItem to='/src/pages/Deal' name='交易信息'/>
        <SideItem to='/src/pages/Seller' name='卖家信息'/>
        <SideItem to='/src/pages/Buyer' name='买家信息'/>
      </NavWrapper>
    </SidebarWrapper>
  );
};

export default Sidebar;