// components/NotesGrid.tsx
import React from "react";
import "./PostsGrid.css";
import PostCard from "../PostCard/PostCard";
import { Post } from "../../Posts";

type PostsGridProps = {
	posts: Post[] | null;
	// department_code: String,
	// class_code: String,
};

const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
	if (!posts || posts.length === 0) {
		return (
			<p>No posts available. Be the first to contribute notes to this class!</p>
		);
	}
	return (
		<section className="posts-grid">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</section>
		// <section className="notes-grid">
		//               {posts.map(post => (
		//             <div className='notes-title' key={post.id}>
		//                 <h3>{post.title}</h3>
		//                 <p>Professor: {post.professor_name}</p>
		//                 {/* <p>Department: {post.department_name}</p> */}
		//                 <p>Date: {post.dt}</p>
		//             </div>
		//         ))}
		// </section>
	);
};

export default PostsGrid;
