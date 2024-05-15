import React, { useState, useMemo } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import Filters from './components/Filters'
import Notes from './components/Notes'
import Footer from './components/Footer'

  // return (
  //   <>
  //     <div>
  //       <h1>Title here</h1>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )

function getUniqueValues(notes: Note[], key: keyof Note): string[] {
  const values = new Set(notes.map(note => note[key]));
  return Array.from(values); // wouldn't return id. If we want to return id, this would cause an error
}

type Note = {
  id: number;
  title: string;
  courseNumber: string;
  professor: string;
  semester: string;
  description: string;
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    courseNumber: "CSCI 5521",
    professor: "Catherine Zhao",
    semester: "Spring 2024",
    description: "CSCI 5521- Machine Learning Fundamentals - Catherine Zhao - (Spring 2024).pdf"
  },
  {
    id: 2,
    title: "Natural Language Processing",
    courseNumber: "CSCI 5541",
    professor: "Dongyeop Kang",
    semester: "Spring 2024",
    description: "CSCI 5541-Natural Language Processing-Dongyeop Kang-(Spring 2024).pdf"
  },
  {
    id: 3,
    title: "Introduction to Artificial Intelligence",
    courseNumber: "CSCI4511W",
    professor: "Maria Gini",
    semester: "Spring 2024",
    description: "CSCI4511W-Introduction to Artificial Intelligence-Maria Gini-(Spring 2024).pdf"
  },
  {
    id: 4,
    title: "Machine Learning: Analysis and Methods",
    courseNumber: "CSCI5525",
    professor: "Paul Schrater",
    semester: "Spring 2024",
    description: "CSCI5525-Machine Learning_ Analysis and Methods-Paul Schrater-(Spring 2024).pdf"
  },
  {
    id: 5,
    title: "Advanced Programming Principles",
    courseNumber: "CSSI2041",
    professor: "James Moen",
    semester: "Spring 2024",
    description: "CSSI2041-Advanced Programming Principles-James Moen-(Spring 2024).pdf"
  }
];



function App() {
  // const [count, setCount] = useState(0)
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [filter, setFilter] = useState({ class: '', professor: '', semester: '', courseNumber: ''});

  const handleFilterChange = (filterType, value) => {
    setFilter(prev => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = (() => {
    setFilter({ class: '', professor: '', semester: '', courseNumber: '' });
  });

  // Dynamically determine the filter values
  const filterOptions = useMemo(() => ({
    courseNumbers: getUniqueValues(notes, 'courseNumber'),
    professors: getUniqueValues(notes, 'professor'),
    semesters: getUniqueValues(notes, 'semester'),
  }), [notes]);

  return (
    <div>
      <Header />
      <Filters onFilterChange={handleFilterChange} filterOptions={filterOptions} onResetFilters={resetFilters}/> {/* Don't really quite understand why need curly brackets over here */}
      <Notes notes={notes} filter={filter}/>
      <Footer/>
    </div>
  );
}

export default App
