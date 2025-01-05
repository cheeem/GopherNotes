import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import "./uploadForm.css"; // Make sure this path is correct in your project
import "../Upload.css";     // If you still need your other CSS

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setMetadata({ ...metadata, [name]: value });
  };

  const handleSelectChange = (selectedOption: any) => {
    setMetadata({ ...metadata, tags: selectedOption });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        fileName: selectedFile.name,
      }));
    }
  };

  const handleFileTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFileType(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file && fileType !== 'text') {
      // Handle the case if no file is selected but user is not uploading text
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('metadata', JSON.stringify(metadata));

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    { label: "Syllabus", value: "syllabus" },
  ];

  // Dropzone logic
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFile({
        file: acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
      setFile(acceptedFiles[0]);
      setMetadata({ ...metadata, fileName: acceptedFiles[0].name });
    },
  });

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="title">Upload Form</h2>
        <ul>
          <li className="floating-label">
            <input
              className="input"
              type="text"
              name="fileName"
              value={metadata.fileName}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label htmlFor="fileName">Notes Name</label>
          </li>

          <li className="floating-label">
            <input
              className="input"
              type="text"
              name="department"
              value={metadata.department}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="department">
              Department Number: e.g. CSCI / MATH / MUS
            </label>
          </li>

          <li className="floating-label">
            <input
              className="input"
              type="text"
              name="courseNumber"
              value={metadata.courseNumber}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="courseNumber">
              Course Number: e.g. 1001, 1301, 5801
            </label>
          </li>

          <li className="floating-label">
            <input
              className="input"
              type="text"
              name="professor"
              value={metadata.professor}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label htmlFor="professor">Professor</label>
          </li>

          <li>
            <label htmlFor="date">Date</label>
            <input
              className="input"
              type="date"
              name="date"
              value={metadata.date}
              onChange={handleInputChange}
            />
          </li>
        </ul>

        <select className="styledSelect" value={fileType} onChange={handleFileTypeChange}>
          <option value="">Select Notes File Type</option>
          <option value="pdf">PDF</option>
          <option value="image">Image</option>
          <option value="text">Text/Link</option>
        </select>

        {fileType === 'text' ? (
          <textarea
            className="textArea"
            name="textLink"
            value={textLink}
            onChange={(e) => setTextLink(e.target.value)}
            placeholder="Enter your text or link here"
          />
        ) : (
          fileType && (
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'dropzoneActive' : ''}`}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div>
                  <p>File uploaded: {uploadedFile.file.name}</p>
                  {uploadedFile.file.type.startsWith('image') && (
                    <img
                      src={uploadedFile.preview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  )}
                </div>
              ) : (
                <p>
                  {isDragActive
                    ? 'Drop the files here...'
                    : "Drag 'n' drop your files here, or click to select files"}
                </p>
              )}
            </div>
          )
        )}
        <button className="button" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
