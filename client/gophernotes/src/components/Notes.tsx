import React from 'react';
import styled from 'styled-components';

const NotesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const NoteCard = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const NoteTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
`;

const NoteDetails = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const ViewButton = styled.button`
  background-color: #004687; // Use your university colors
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  width: 100%;
  text-align: center;
`;

const Notes = ({notes, filter}) => {
    console.log(notes[0]);
    console.log(filter.courseNumber==='');
    console.log(filter.courseNumber);
    const filteredNotes = notes.filter(note =>
        (filter.courseNumber === '' || note.courseNumber === filter.courseNumber) &&
        (filter.professor === '' || note.professor === filter.professor) &&
        (filter.semester === '' || note.semester === filter.semester)
      );
    // const filteredNotes = notes;


  return (
    <NotesContainer>
        {filteredNotes.length > 0 ? filteredNotes.map((note, index) => (
        <NoteCard key={index}>
          <NoteTitle>{note.title}</NoteTitle>
          <NoteDetails>{note.courseNumber} - {note.professor}</NoteDetails>
          <NoteDetails>{note.description}</NoteDetails>
          <ViewButton>View</ViewButton>
        </NoteCard>
      )) : <p>No notes found for the selected filters.</p>}
    </NotesContainer>
  );
};

export default Notes;
