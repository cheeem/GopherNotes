// src/components/SortBar.tsx
import React from "react";
import styled from "styled-components";
import "./SortBar.css";

const SortBarContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 20px;
	background-color: #ffffff;
	border-bottom: 1px solid #cccccc;
`;

const EmptyRow = styled.div`
	height: 40px;
`;

const StyledButton = styled.button`
	border-radius: 4px;
`;

const SortBar = () => {
	return (
		<div className="sort-bar">
			<SortBarContainer>
				<div className="sort-options">
					<button className="sort-button">Popularity </button>
					<button className="sort-button">Date</button>
					<button className="sort-button">Relevance</button>
				</div>

				<div className="view-options">
					<button className="sort-button">Grid View</button>
					<button className="sort-button">List View</button>
				</div>
			</SortBarContainer>
			<EmptyRow></EmptyRow>
		</div>
	);
};

export default SortBar;
