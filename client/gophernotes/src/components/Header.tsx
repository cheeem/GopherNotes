import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #004687; // Replace with your university colors
`;

const Logo = styled.img`
  height: 50px;
`;

const SearchBar = styled.input`
  width: 60%;
  padding: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  color: #fff;
  background-color: #007bff;
  border: none;
  cursor: pointer;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo src="/path-to-your-logo.png" alt="Logo" />
      <SearchBar type="text" placeholder="Search notes..." />
      <div>
        <Button>Login</Button>
        <Button>Sign Up</Button>
      </div>
    </HeaderContainer>
  );
};

export default Header;
