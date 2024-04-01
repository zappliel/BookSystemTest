import React from 'react';
import { Navigate, useNavigate } from "react-router-dom"; 
import { MDBBtn } from 'mdb-react-ui-kit';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Username:', username);
    console.log('Password:', password);

    navigate('/checkmain'); // 替换为您要跳转的路径
  };

  return (
    <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleClick}>登录</MDBBtn>
  );
};

export default LoginButton;
