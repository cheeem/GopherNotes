// pages/ProfilePage.tsx
import React from "react";
import ProfilePictureUpvotes from "../../components/ProfilePictureUpvotes/ProfilePictureUpvotes";
import PostsGrid from "../../components/PostGrid/PostsGrid";
import { Post } from "../../routes/Posts/Posts";
import { useState } from "react";
import "./ProfilePage.css";

// Mock user and posts data
const mockUser = {
	name: "Jackson Robert",
	avatarUrl: "https://via.placeholder.com/150",
	upvotes: 120,
	major: "Computer Science",
	classYear: "Sophomore",
	department: "Engineering",
	bio: "I love algorithms, data structures, and helping people learn to code.",
};

const mockMyNotes: Post[] = [
	{
		id: 1,
		title: "CS1101",
		text: "Python Syllabus",
		path: "https://via.placeholder.com/300",
		upload_type: 1,
		dt: "123",
		professor_name: "Dean",
	},
	{
		id: 2,
		title: "CS1301",
		text: "Syllabus",
		path: "https://via.placeholder.com/300",
		upload_type: 1,
		dt: "123",
		professor_name: "Dean",
	},
];

const mockSavedNotes: Post[] = [
	{
		id: 3,
		title: "CSCI2021",
		text: "Syllabus",
		path: "https://via.placeholder.com/300",
		upload_type: 1,
		dt: "123",
		professor_name: "Dean",
	},
	{
		id: 4,
		title: "CSCI5541",
		text: "Syllabus",
		path: "https://via.placeholder.com/300",
		upload_type: 1,
		dt: "123",
		professor_name: "Dean",
	},
];

const mockRecentNotes: Post[] = [
	{
		id: 5,
		title: "CSCI5525",
		text: "Python Syllabus",
		path: "https://via.placeholder.com/300",
		upload_type: 1,
		dt: "123",
		professor_name: "Dean",
	},
	{
		id: 6,
		title: "CS1301",
		text: "Syllabus",
		path: "https://via.placeholder.com/300",
		upload_type: 1,
		dt: "123",
		professor_name: "Dean",
	},
];

const ProfilePage: React.FC = () => {
	const user = mockUser;
	const myNotes = mockMyNotes;
	const [activeSection, setActiveSection] = useState<
		"MY_NOTES" | "SAVED_NOTES" | "RECENT_NOTES"
	>("MY_NOTES");
	const savedNotes = mockSavedNotes;
	const recentNotes = mockRecentNotes;

	// Determine which posts to show based on the active tab
	let displayedPosts: Post[] = [];
	if (activeSection === "MY_NOTES") displayedPosts = myNotes;
	if (activeSection === "SAVED_NOTES") displayedPosts = savedNotes;
	if (activeSection === "RECENT_NOTES") displayedPosts = recentNotes;

	return (
		<div className="profile-page-container">
			{/* Left Sidebar/Column: User Profile Info */}
			<aside className="profile-sidebar">
				<div className="profile-header">
					<ProfilePictureUpvotes
						avatarUrl={user.avatarUrl}
						upvotes={user.upvotes}
						name={user.name}
					/>
					<div className="user-info">
						<h2>{user.name}</h2>
						<p>
							<strong>Major:</strong> {user.major}
						</p>
						<p>
							<strong>Class Year:</strong> {user.classYear}
						</p>
						<p>
							<strong>Department:</strong> {user.department}
						</p>
						<p className="user-bio">{user.bio}</p>
					</div>
				</div>
				<nav className="profile-nav">
					<button
						className={`profile-nav-button ${
							activeSection === "MY_NOTES" ? "active" : ""
						}`}
						onClick={() => setActiveSection("MY_NOTES")}
					>
						MyNotes
					</button>
					<button
						className={`profile-nav-button ${
							activeSection === "SAVED_NOTES" ? "active" : ""
						}`}
						onClick={() => setActiveSection("SAVED_NOTES")}
					>
						Saved Notes
					</button>
					<button
						className={`profile-nav-button ${
							activeSection === "RECENT_NOTES" ? "active" : ""
						}`}
						onClick={() => setActiveSection("RECENT_NOTES")}
					>
						Recent Notes
					</button>
				</nav>
			</aside>

			{/* Main Content: Notes Sections */}
			<main className="profile-main">
				<PostsGrid posts={displayedPosts} />
			</main>
		</div>
	);
};

export default ProfilePage;
