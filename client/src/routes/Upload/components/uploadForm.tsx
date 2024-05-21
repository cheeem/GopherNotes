import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Select from 'react-select';;



const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 
  background-color: #f8f9fa; // Light grey background
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  max-width: 500px; // Maximum width of the form
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #A2D9CE;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #40E0D0;
  }
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
`;

interface OptionType {
    label: string;
    value: string;
  }

function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        fileName: '',
        courseNumber: '',
        department: '',
        professor: '',
        date: '',
        tags: [] as OptionType[]
    });

    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        setMetadata({...metadata, [event.target.name]: event.target.value});
    };

    const handleSelectChange = (selectedOption: any) => {
        setMetadata({...metadata, tags: selectedOption});
    }

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;

        if (selectedFile) {
            setFile(event.target.files[0]);
            setMetadata(prevMetadata => ({
                ...prevMetadata,
                fileName: selectedFile.name
            })
            )
        }
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const tagOptions: OptionType[] = [
        { label: "Week1", value: "week1" },
        { label: "Week2", value: "week2" },
        { label: "Week3", value: "week3" },
        { label: "PDF", value: "pdf" },
        { label: "image", value: "image" },
        { label: "Syllabus", value: "syllabus" }
    ];

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Title>Upload Form</Title>
                <Input type="text" name="fileName" value={metadata.fileName} onChange={handleInputChange} placeholder="Notes Name" />
                <Input type="text" name="department" value={metadata.department} onChange={handleInputChange} placeholder="Department Number: e.g. CSCI / MATH / MUS" required/>
                <Input type="text" name="courseNumber" value={metadata.courseNumber} onChange={handleInputChange} placeholder="Course Number: e.g. 1001, 1301, 5801" required/>
                <Input type="text" name="professor" value={metadata.professor} onChange={handleInputChange} placeholder="Professor" />
                <Input type="date" name="date" value={metadata.date} onChange={handleInputChange} />
                <Select
                    isMulti
                    name="tags"
                    options={tagOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleSelectChange as any}
                    placeholder="Select Tags"
                    closeMenuOnSelect={false}
                />
                <Input type="file" onChange={handleFileChange} />
                <Button type="submit" onClick={handleSubmit}>Upload</Button>
            </Form>
        </Container>
    );
}

export default UploadForm;
