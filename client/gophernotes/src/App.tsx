import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import './App.css'
import Header from './components/Header';
import Filters from './components/Filters'
import Notes from './components/Notes'
import Footer from './components/Footer'
import axios from 'axios';


type Note = {
  id: number;
  title: string;
  course_number: string;
  professor: string;
  semester: string;
  description: string;
};


const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1; 
  padding: 20px;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ccc;

  @media (max-width: 768px) {
    width: 100px; 
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
`;


function getUniqueValues(notes: Note[], key: keyof Note): string[] {
  const values = new Set(notes.map(note => String(note[key])));
  return Array.from(values); // wouldn't return id. If we want to return id, this would cause an error
}



function App() {
  
    // const [count, setCount] = useState(0)
    const [notes, setNotes] = useState<Note[]>([]);
    const [filter, setFilter] = useState({ class: '', professor: '', semester: '', course_number: ''});


    useEffect(() => {
      const fetchNotes = async () => {
        try {
          const response = await fetch('http://localhost:3000/');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setNotes(data);
        } catch (error) {
          console.error("Failed to fetch notes:", error);
        }
      };
    
      fetchNotes();
    }, []);

    const handleFilterChange = (filterType:any, value:any) => {
      setFilter(prev => ({ ...prev, [filterType]: value }));
    };

    const resetFilters = (() => {
      setFilter({ class: '', professor: '', semester: '', course_number: '' });
    });
    
    // Dynamically determine the filter values
    const filterOptions = useMemo(() => ({
      course_number: getUniqueValues(notes, 'course_number'),
      professors: getUniqueValues(notes, 'professor'),
      semesters: getUniqueValues(notes, 'semester'),
    }), [notes]);
    console.log(getUniqueValues(notes, 'course_number'));

    

    // const [a,b] = useEffect(() => {
    //   fetch('http://localhost:8080/api/notes')
    //     .then(response => response.json())
    //     .then(data => setNotes(data));
    // }
    // , []);
    return (
      <div>
        <AppContainer>
        <Header />

        <ContentContainer>
          <Sidebar>
            <Filters onFilterChange={handleFilterChange} filterOptions={filterOptions} onResetFilters={resetFilters}/> {/* Don't really quite understand why need curly brackets over here */}
          </Sidebar>

          <MainContent>
            <Notes notes={notes} filter={filter}/>
          </MainContent>
        </ContentContainer>

        <Footer/>


        </AppContainer>
      </div>
    );
}

export default App



