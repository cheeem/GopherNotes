// components/Filter.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  margin-right: 1rem;
`;

const FilterHeading = styled.h4`
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background-color: #333;
  color: white;
  border-radius: 4px;
`;

const FilterLabel = styled.label`
  margin-right: 0.5rem;
`;

const ToggleButton = styled.button`
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  background-color: #333;
  color: white;
`;

const FilterButton = styled.button<{isActive: boolean}>`
  padding: 8px 12px;
  margin-right: 5px;
  background-color: ${({ isActive }) => isActive ? 'gray' : 'white'};
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ isActive }) => isActive ? 'darkgray' : 'white'};
    // set color to a darker shade of the background but not white or black
    color: ${({ isActive }) => isActive ? 'white' : 'gray'};
  }
`;


const Filter: React.FC = () => {
  
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const toggleFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  const [filters, setFilters] = useState({
    professor: [],
    popularity: false,
    weeks: [],
    tags: []
  });


  const toggleFilter = (category: string, option: string) => {
    const newFilters = {...filters};

    // For boolean filters like popularity, date, relevance
    if (typeof newFilters[category] === 'boolean') {
      newFilters[category] = !newFilters[category];
    } else {
      // For array filters like professor
      if (newFilters[category].includes(option)) {
        newFilters[category] = newFilters[category].filter(item => item !== option);
      } else {
        newFilters[category].push(option);
      }
    }

    setFilters(newFilters);
  };

  return (
    <FilterContainer>
      <FilterRow>
      </FilterRow>
      <FilterRow>
        <FilterGroup>
          <FilterHeading>Professor</FilterHeading>

          {/* display possible professors to select from */}
          <FilterButton isActive={filters.professor.includes('Prof1')} onClick={() => toggleFilter('professor', 'Prof1')}>Prof1</FilterButton>
          <FilterButton isActive={filters.professor.includes('Prof2')} onClick={() => toggleFilter('professor', 'Prof2')}>Prof1</FilterButton>
          <FilterButton isActive={filters.professor.includes('Prof3')} onClick={() => toggleFilter('professor', 'Prof3')}>Prof1</FilterButton>
          
        </FilterGroup>
        <ToggleButton onClick={toggleFilters}>
          {showMoreFilters ? 'Hide Filters' : 'Show More Filters'}
        </ToggleButton>
      </FilterRow>
      {showMoreFilters && (
        <>
          <FilterRow>
            <FilterGroup>
              <FilterHeading>Week</FilterHeading>
              {/* display possible weeks to select from */}
              {['Week 1', 'Week 2', 'Week 3'].map(week => (
              <FilterButton
                key={week}
                isActive={filters.weeks.includes(week)}
                onClick={() => toggleFilter('weeks', week)}
              >
                {week}
              </FilterButton>
            ))}

            </FilterGroup>
          </FilterRow>
          <FilterRow>

            <FilterGroup>
              <FilterHeading>Tags</FilterHeading>
              {/* dislay the list of tags */}
              {['PDF', 'Image', 'Handwritten', "External Resources"].map(tag => (
                <FilterButton
                  key={tag}
                  isActive={filters.tags.includes(tag)}
                  onClick={() => toggleFilter('tags', tag)}
                >
                  {tag}
                </FilterButton>
              ))}

            </FilterGroup>

          </FilterRow>
        </>
      )}
    </FilterContainer>
  );
};

export default Filter;
