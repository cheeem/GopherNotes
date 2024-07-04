// components/NotesGrid.tsx
import React from 'react';
import "./PostsGrid.css";


type Post = {
  id: number,
  file_type: String,
  path: String,
  dt: String, // TODO: Needs modification
  class_name: String,
  department_name: String, 
  professor_name: String
}


type PostsGridProps = {
  posts: Post[] | null;
}

const PostsGrid: React.FC<PostsGridProps> = ({posts}) => {
  if (!posts || posts.length === 0) {
    return <p>No posts available. Be the first to contribute notes to this class!</p>;
  }
  return (
    <div className="GridContainer">
                  {posts.map(post => (
                <div className='PostCard' key={post.id}>
                    <h3>{post.class_name}</h3>
                    <p>Professor: {post.professor_name}</p>
                    <p>Department: {post.department_name}</p>
                    <p>Date: {post.dt}</p>
                </div>
            ))}
    </div>
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
