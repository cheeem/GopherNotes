import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Select from 'react-select';;
import { useDropzone } from 'react-dropzone';
import "../Upload.css";



const Dropzone = styled.div`
  flex: 1;
  display: flex;
  flexDirection: column;
  alignItems: center;
  padding: 20px;
  borderWidth: 2px;
  borderRadius: 2px;
  border-style: dashed;
  borderColor: '#eeeeee';
  backgroundColor: '#fafafa';
  color: '#bdbdbd';
  outline: 'none';
  transition: border .24s ease-in-out;
`;


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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 8px 10px; 
  margin: 10px 0 0 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
`;

interface OptionType {
    label: string;
    value: string;
  }

const fileOptions = [
{ label: "PDF", value: "pdf" },
{ label: "Image", value: "image" },
{ label: "Text/Link", value: "text" }
];


function UploadForm() {
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [textLink, setTextLink] = useState('');
    const [metadata, setMetadata] = useState({
        fileName: '',
        courseNumber: '',
        department: '',
        professor: '',
        date: '',
        tags: [] as OptionType[]
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setMetadata({...metadata, [name]: value});
      };

    const handleSelectChange = (selectedOption: any) => {
        setMetadata({...metadata, tags: selectedOption});
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
          setFile(selectedFile);
          setMetadata(prevMetadata => ({
            ...prevMetadata,
            fileName: selectedFile.name
          }));
        }
      };

    const handleFileTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFileType(event.target.value);
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

    // Dynamically render the dropzone based on the file type selected
    const [uploadedFile, setUploadedFile] = useState(null);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: acceptedFiles => {
          setUploadedFile({
            file: acceptedFiles[0],
            preview: URL.createObjectURL(acceptedFiles[0])
          });
          setFile(acceptedFiles[0]);
          setMetadata({...metadata, fileName: acceptedFiles[0].name});
        }
      });

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Title>Upload Form</Title>
                <ul>
                    <li>
                        <Input type="text" name="fileName" value={metadata.fileName} onChange={handleInputChange} placeholder=" " />
                        <label htmlFor="fileName">Notes Name</label>
                    </li>

                    <li>
                        <Input type="text" name="department" value={metadata.department} onChange={handleInputChange} placeholder=" " required/>
                        <label htmlFor="department">Department Number: e.g. CSCI / MATH / MUS</label>
                    </li>

                    <li>
                        <Input type="text" name="courseNumber" value={metadata.courseNumber} onChange={handleInputChange} placeholder=" " required/>
                        <label htmlFor="courseNumber">Course Number: e.g. 1001, 1301, 5801</label>
                    </li>

                    <li>
                        <Input type="text" name="professor" value={metadata.professor} onChange={handleInputChange} placeholder=" " />
                        <label htmlFor="professor">Professor</label>
                    </li>

                    <li>
                        <label htmlFor="date">Date</label>
                        <Input type="date" name="date" value={metadata.date} onChange={handleInputChange} />
                    </li>
                    {/* <Select
                    isMulti
                    name="tags"
                    options={tagOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleSelectChange as any}
                    placeholder="Select Tags"
                    closeMenuOnSelect={false}
                /> */}
                </ul>

                <StyledSelect value={fileType} onChange={handleFileTypeChange}>
                    <option value="">Select Notes File Type</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                    <option value="text">Text/Link</option>
                </StyledSelect>
            {fileType === 'text' ? (
                <TextArea name="textLink" value={textLink} onChange={(e) => setTextLink(e.target.value)} placeholder="Enter your text or link here" />
                ) : (
                fileType && 
                
                <Dropzone {...getRootProps()}>
                    <input {...getInputProps()} />
                    {uploadedFile ? (
                        <div>
                        <p>File uploaded: {uploadedFile.file.name}</p>
                        {uploadedFile.file.type.startsWith('image') && (
                            <img src={uploadedFile.preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        )}
                        </div>
                    ) : (
                        <p>{isDragActive ? 'Drop the files here...' : 'Drag \'n\' drop your files here, or click to select files'}</p>
                    )}
                </Dropzone>
                )}
                <Button type="submit" onClick={handleSubmit}>Upload</Button>
            </Form>
        </Container>
    );
}

export default UploadForm;
