import React from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f1f1f1;
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 10px;
  width: 20%;
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  background-color: #cc0000;
  color: white;
  border: none;
  cursor: pointer;
`;


const Filters = ({ onFilterChange, filterOptions, onResetFilters }) => {
    return (
      <FiltersContainer>
        <Select onChange={e => onFilterChange('courseNumber', e.target.value)}>
          <option value="">Select Class Number</option>
          {filterOptions.courseNumbers.map(courseNumber => (
            <option key={courseNumber} value={courseNumber}>{courseNumber}</option>
          ))}
        </Select>
  
        <Select onChange={e => onFilterChange('professor', e.target.value)}>
          <option value="">Select Professor</option>
          {filterOptions.professors.map(professor => (
            <option key={professor} value={professor}>{professor}</option>
          ))}
        </Select>
  
        <Select onChange={e => onFilterChange('semester', e.target.value)}>
          <option value="">Select Semester</option>
          {filterOptions.semesters.map(semester => (
            <option key={semester} value={semester}>{semester}</option>
          ))}
        </Select>
        <ResetButton onClick={onResetFilters}>Reset Filters</ResetButton>
      </FiltersContainer>
    );
  };
  

export default Filters;
