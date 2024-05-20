import React from 'react';
import './App.css';
import Header from './components/Header';
import Filter from './components/Filter';
import NotesGrid from './components/NotesGrid';
import SortBar from './components/SortBar';
import styled from 'styled-components';

const StyledApp = styled.div`
  background-color: #f0f0f0;
  margin: 2% 15% 50% 15%;
`;

const MainContent = styled.main`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;



const App: React.FC = () => {
  return (
    <StyledApp>
        <Header />

        <MainContent>
          <Filter />
          <SortBar />
          <NotesGrid />
        </MainContent>

    </StyledApp>
  );
};

export default App;
