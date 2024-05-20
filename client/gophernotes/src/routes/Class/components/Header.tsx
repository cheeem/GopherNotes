// components/Header.tsx
import React from 'react';
import styled from 'styled-components';

// implement search-bar container that makes the search bar much bigger 
// and the button is styled to match the search bar
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0; 
`;

const ClassNumber = styled.p`
  width: 10%;
`;

const SearchBar = styled.input`
  width: 60%;
  padding: 10px;
  height: 30px;
  border-radius: 10px;
  border-color: #f0f0f0;
  border-width: 1px;
`;

const Button = styled.button`
  width: 100px;
  padding: 10px 20px;
  margin-left: 10px;
  color: black;
  background-color: white;
  border: none;
  cursor: pointer;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <ClassNumber>
        <h2>CSCI 2048</h2>
      </ClassNumber>
      <SearchBar type="text" placeholder="We could maybe even allow for keyword search here..." />
      <div>
        <Button>Login</Button>
        <Button>Sign Up</Button>
      </div>
    </HeaderContainer>
  );
};

export default Header;
