import React from 'react';
// import './App.css';
import styled from 'styled-components';
import UploadForm from './components/uploadForm';

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
    <UploadForm />
  );
};

export default App;
