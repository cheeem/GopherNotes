// components/NotesGrid.tsx
import React from 'react';
import "./PostsGrid.css";
import { Post } from '../Posts';


type PostsGridProps = {
  posts: Post[] | null,
  // department_code: String,
  // class_code: String,
  
}

const PostsGrid: React.FC<PostsGridProps> = ({posts}) => {
  if (!posts || posts.length === 0) {
    return <p>No posts available. Be the first to contribute notes to this class!</p>;
  }
  return (
    <section className="notes-grid">
                  {posts.map(post => (
                <div className='notes-title' key={post.id}>
                    <h3>{post.title}</h3>
                    <p>Professor: {post.professor_name}</p>
                    {/* <p>Department: {post.department_name}</p> */}
                    <p>Date: {post.dt}</p>
                </div>
            ))}
    </section>
    // <section className="notes-grid">
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 1</p>

    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 2</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 3</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 4</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 5</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 6</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 7</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 8</p>

    //       </div>

    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 1</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 2</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 3</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 4</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 5</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 6</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes1.jpg" alt="notes 1" />
    //         <h3>notes 1</h3>
    //         <p>Description of notes 7</p>
            
    //       </div>
    //       <div className="notes-tile">
    //         <img src="notes2.jpg" alt="notes 2" />
    //         <h3>notes 2</h3>
    //         <p>Description of notes 8</p>

    //       </div>
    // </section>
  );
};

export default PostsGrid;
