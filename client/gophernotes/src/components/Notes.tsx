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
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    border-color: #004687; 
  }
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

type Note = {
    id: number;
    title: string;
    course_number: string;
    professor: string;
    semester: string;
    description: string;
  };
  
const Notes = ({notes, filter}) => {

    const filteredNotes = notes.filter((note: Note) =>
            (filter.course_number === '' || note.course_number === filter.course_number) &&
            (filter.professor === '' || note.professor === filter.professor) &&
            (filter.semester === '' || note.semester === filter.semester)
        );
    // const filteredNotes = notes;

    console.log(filteredNotes[0]);
    return (
        <NotesContainer>
                {filteredNotes.length > 0 ? filteredNotes.map((note: Note, index: number) => (
                <NoteCard key={index}>
                    <NoteTitle>{note.title}</NoteTitle>
                    <NoteDetails>{note.course_number} - {note.professor}</NoteDetails>
                    <NoteDetails>{note.description}</NoteDetails>
                    <ViewButton>View</ViewButton>
                </NoteCard>
            )) : <p>No notes found for the selected filters.</p>}
        </NotesContainer>
    );
};

export default Notes;
