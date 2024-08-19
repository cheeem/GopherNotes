// components/PostCard.tsx
import React from "react";
import { useNavigate} from 'react-router-dom';
import "./PostCard.css";
import { Post } from "../../Posts";

type PostCardProps = {
	post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    // const history = useHistory();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/post/${post.id}`);
    }
	return (
		<div className="post-card" onClick={handleClick}>
			<div className="post-header">
				<div className="post-title">
					<h3>{post.title}</h3>
					<p>{post.text}</p>
				</div>
				<div className="post-rating">
					<span>5</span>
					<div className="arrows">
						<span>&uarr;</span>
						<span>&darr;</span>
					</div>
				</div>
			</div>
			<div className="post-image">
				<img src={post.path.toString()} alt={post.title.toString()} />
			</div>
			<div className="post-footer">
				<p>{post.text}</p>
				<div className="post-icons">
					<span>&#x1F4AC;</span>
					<span>&#x1F4DD;</span>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
