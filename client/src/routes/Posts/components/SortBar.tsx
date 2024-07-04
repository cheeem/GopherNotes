// src/components/SortBar.tsx
import React from 'react';
import styled from 'styled-components';

const SortBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #cccccc;
`;

const EmptyRow = styled.div`
    height: 40px;
    `;

const StyledButton = styled.button`
  border-radius: 4px;
`



const SortBar = () => {
  return (
    <div className="sort-bar">
        <SortBarContainer>
      <div className="sort-options">
        <StyledButton>Popularity</StyledButton>
        <StyledButton>Date</StyledButton>
        <StyledButton>Relevance</StyledButton>
      </div>

      <div className="view-options">
      <StyledButton>Grid View</StyledButton>
      <StyledButton>List View</StyledButton>
      </div>

      </SortBarContainer>
      <EmptyRow></EmptyRow> 
    </div>
  );
};

export default SortBar;
