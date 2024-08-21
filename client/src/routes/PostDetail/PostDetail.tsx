import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Post} from '../Posts/Posts';
import "./PostDetail.css";


const PostDetail: React.FC = () => {
    const location = useLocation();
    const post = location.state?.post as Post;
    const { postId } = useParams<{ postId: string }>() ?? { postId: "" };
    // const post = posts.find(p => p.id === parseInt(postId || ""));

    if (!post) {
        return <p>Post not found!</p>;
    }

    return (
        <div className='post-detail-container'>
            <h1>{post.title}</h1>
            <p>Professor: {post.professor_name}</p>
            <p>Date: {post.dt}</p>
            <img src={post.path.toString()} alt={post.title.toString()} />
            <p>{post.text}</p>
            <p>{post.text}</p>
        </div>
    );
};

export default PostDetail;
