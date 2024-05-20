import React from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
  background-color: #f1f1f1;
`;

const Select = styled.select`
  padding: 8px;
  margin-right: 10px;
  width: 100%;
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  background-color: #cc0000;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
`;



const Filters = ({ onFilterChange, filterOptions, onResetFilters }: { onFilterChange: (key: string, value: string) => void, filterOptions: any, onResetFilters: () => void }) => {
    return (
      <FiltersContainer>
        <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('course_number', e.target.value)}>
          <option value="">Select Class Number</option>
          {filterOptions.course_number.map((course_number: string) => (
            <option key={course_number} value={course_number}>{course_number}</option>
          ))}
        </Select>

        <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('professor', e.target.value)}>
          <option value="">Select Professor</option>
          {filterOptions.professors.map((professor: string) => (
            <option key={professor} value={professor}>{professor}</option>
          ))}
        </Select>

        <Select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('semester', e.target.value)}>
          <option value="">Select Semester</option>
          {filterOptions.semesters.map((semester: string) => (
            <option key={semester} value={semester}>{semester}</option>
          ))}
        </Select>
        <ResetButton onClick={onResetFilters}>Reset Filters</ResetButton>
      </FiltersContainer>
    );
  };
  

export default Filters;
