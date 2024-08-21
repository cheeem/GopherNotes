// components/PostCard.tsx
import React from "react";
// import { useNavigate} from 'react-router-dom';
import { Link } from "react-router-dom";
import "./PostCard.css";
import { Post } from "../../Posts";

type PostCardProps = {
	post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	// const history = useHistory();
	// const navigate = useNavigate();

	// const handleClick = () => {
	//     navigate(`/post/${post.id}`);
	// }
	return (
		<div className="post-card">
      <div className="post-header">
        <div className="post-title">
          <h3>{post.title}</h3>
          <p>{post.text}</p>
        </div>
        <div className="rating">
          <button className="vote-button">&uarr;</button> {/* Upvote */}
          {/* <span>{post.voteCount}</span> Vote count */}
		  <span>5</span>
          <button className="vote-button">&darr;</button> {/* Downvote */}
        </div>
      </div>
			<div className="post-image">
				<Link to={`/post/${post.id}`} state={{ post }}>
					<img src={post.path.toString()} alt={post.title.toString()} />
				</Link>
			</div>
			<div className="post-footer">
				<p>{post.text}</p>
				<p>Additional information Here</p>

			</div>
		</div>
	);
};

export default PostCard;
