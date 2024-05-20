import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #004687; // Adjust to match your university colors
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const Link = styled.a`
  color: white;
  margin-right: 20px;
  &:hover {
    color: #ccc;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <LeftSection>
        <p>Contact us at werne642@umn.edu</p>
        <p>Visit our library page or student support services.</p>
      </LeftSection>
      <RightSection>
        <Link href="#">Facebook</Link>
        <Link href="#">Twitter</Link>
        <Link href="#">LinkedIn</Link>
      </RightSection>
    </FooterContainer>
  );
};

export default Footer;
