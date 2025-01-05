import { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import "./Upload.css";
import React from 'react';
import styled from 'styled-components';
import UploadForm from './components/uploadForm';


const App: React.FC = () => {
  return (
    <UploadForm />
  );
};

export default App;
