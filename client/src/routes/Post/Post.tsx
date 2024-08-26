import { useState, useEffect, } from "react";
import { useParams, Link } from "react-router-dom";
import { base_api_url } from "../../constants";
import "./Post.css";

type Post = {
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

export default function Post() {

    const params = useParams();

    const department_code: string = params.department_code!;
    const class_code: string = params.class_code!;
    const post_id: string = params.post_id!;

    const [post, setPost] = useState<Post | null>(null);
    //const [comments, setComments] = useState<Comment[] | null>(null);

    useEffect(() => {
        getPost(post_id, setPost);
    }, []);

    return (
        <article id="post">
            {post ? <Content post={post} department_code={department_code}  class_code={class_code} /> : <LoadingContent />}
            {/* <section className="comments">
            </section> */}
        </article>
    )

}

function LoadingContent() {
    return (
        <section className="content">
            <header>
                
            </header>
            <div className="body">

            </div>
            <div className="footer">

            </div>
        </section>
    )
}

function Content(props: { post: Post, department_code: string, class_code: string, }) {

    return (
        <section className="content">
            <header>
                <div>
                    <h1>{props.post.title}</h1>
                    <Link to={`/user/${props.post.user_id}`}><p className="username">{props.post.username}</p></Link>
                </div>
                <div className="post-vote">
                    <h5>{props.post.score}</h5>
                    <button>+</button>
                    <button>-</button>
                </div>
            </header>
            <div className="image">
                <img src={props.post.file_name} alt="" />
            </div>
            <div className="post-footer">
                <div>
                    <Link to={`/${props.department_code}/${props.class_code}/`}>
                        <p className="class">{props.department_code} {props.class_code}</p>
                    </Link>
                    <p>Professor {props.post.professor_name}</p>
                </div>
                <p>{new Date(props.post.dt).toLocaleDateString()}</p>
            </div>
        </section>
    )

}

async function getPost(post_id: string, setPost: React.Dispatch<React.SetStateAction<Post | null>>) {

    return setPost({
        title: "My Cat 123",
        score: 5,
        upload_type: 0,
        file_name: "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
        dt: "2024-04-20 00:00:00",
        professor_name: "Michael Rodgers",
        user_id: 2,
        username: "jonathansmith",
    });

    let url: string = `${base_api_url}/post/get_post?id=${post_id}`;

    let res: Response;

    try {   
        res = await fetch(url);
    } catch(err) {
        return console.log(err);
    }
        
    if(res!.ok === false) {
        return console.log(res.status);
    }
        
    try {
        setPost(await res!.json());
    } catch(err) {
        console.log(err);
    }

}