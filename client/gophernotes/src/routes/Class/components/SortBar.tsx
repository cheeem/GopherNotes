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


const SortBar = () => {
  return (
    <div className="sort-bar">
        <SortBarContainer>
      <div className="sort-options">
        <button>Popularity</button>
        <button>Date</button>
        <button>Relevance</button>
      </div>

      <div className="view-options">
      <button>Grid View</button>
      <button>List View</button>
      </div>

      </SortBarContainer>
      <EmptyRow></EmptyRow> 
    </div>
  );
};

export default SortBar;
