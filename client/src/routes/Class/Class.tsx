import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Class.css";
import svg_search from "../../img/Search.svg";

type Post = {
    id: number,
    title: string,
    score: number,
    upload_type: number,
    file_name?: string,
    dt: string, 
    text?: string | null,
    professor_name: string,
    user_id: number,
    username: string,
}

export default function Class(): JSX.Element {

    const params = useParams();

    const department_code: string = params.department_code!;
    const class_code: string = params.class_code!;

    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        getPosts(department_code, class_code, setPosts);
    }, [])

    return (
        <article id="class">
            <section className="hero">
                <header>
                    <h1>{department_code} {class_code}</h1>
                    <h3>Introduction to Computer Programming in Java</h3>
                </header>
                <div className="search">
                    <div className="search-options">
                        <h5> Search By </h5>
                        <button className="active">Title</button>
                        <button>Professor</button>
                    </div>
                    <div className="search-input">
                        <img src={svg_search} alt="" />
                        <input type="text" name="input" />
                    </div>
                </div>
            </section>
            {/* <section className="options">
                <div className="sort-options">

                </div>
                <div className="viewoptions">

                </div>
            </section> */}
            <section className="posts">
                <ul>
                    {!posts ? null : posts.map(post => (
                        <li className="post" key={post.id}>
                            <div className="post-header">
                                <div>
                                    <a className="title" href={`https://gophernotes.com/posts/${post.id}`}>{post.title}</a>
                                    <a className="username" href={`https://gophernotes.com/users/${post.user_id}`}>{post.username}</a>
                                </div>
                                <div className="post-vote">
                                    <h5>{post.score}</h5>
                                    <button>+</button>
                                    <button>-</button>
                                </div>
                            </div>
                            <a className="image" href={`https://gophernotes.com/posts/${post.id}`}><img src={post.file_name} alt="" /></a>
                            <div className="post-footer">
                                <p>Professor {post.professor_name}</p>
                                <p>{new Date(post.dt).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    )
}

async function getPosts(department_code: string | null, class_code: string | null, setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>) {

    setPosts(Array.from({ length: 8, }, () => ({
        id: 1, 
        title: "My Cat 123",
        score: 5,
        upload_type: 0,
        file_name: "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
        dt: "2024-04-20 00:00:00",
        professor_name: "Michael Rodgers",
        user_id: 2,
        username: "jonathansmith",
    }))); return;

    let url: string = `http://localhost:3000/home/get_posts?department_code=${department_code}&class_code=${class_code}`

    let res: Response;

    try {   
        res = await fetch(url);
    } catch(err) {
        console.log(err);
    }
        
    if(res!.ok === false) {
        return console.log(res.status);
    }
        
    try {
        setPosts(await res!.json());
    } catch(err) {
        console.log(err);
    }

}

// function renderPost(post: Post) {

//     switch(post.upload_type) {
//         case 0:
//             return <ImagePost post={post} />
//         case 1: 
//             return <PDFPost post={post} /> 
//         case 2: 
//             return <TextPost post={post} />
//     }

// }

// function ImagePost({ post }: { post: Post }) {
//     return <img src={post.path} alt="" />
// }

// function PDFPost({ post }: { post: Post }) {
//     return null;
// }

// function TextPost({ post }: { post: Post }) {
//     return null;
// }
