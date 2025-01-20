import React, { useState, useEffect, } from "react";
import { useParams, Link } from "react-router-dom";
import { base_api_url, uploads_path } from "../../constants";
import "./Post.css";

type Post = {
    title: string,
    score: number,
    upload_type: number,
    file_name?: string,
    dt: number, 
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
            {post ? <Body id={post_id} post={post} department_code={department_code}  class_code={class_code} /> : <LoadingBody />}
            {/* <section className="comments">
            </section> */}
        </article>
    )

}

function LoadingBody() {
    return (
        <section className="body">
            <header>
                
            </header>
            <div className="body">

            </div>
            <div className="footer">

            </div>
        </section>
    )
}

function Body(props: { id: string, post: Post, department_code: string, class_code: string, }) {

    const [score, setScore] = useState<number>(props.post.score);

    return (
        <section>
            <header>
                <div>
                    <h1>{props.post.title}</h1>
                    <Link to={`/user/${props.post.user_id}`}><p className="username">{props.post.username}</p></Link>
                </div>
                <div className="post-vote">
                    <h5>{score}</h5>
                    <button onClick={() => increment_post_score(props.id, setScore)}>+</button>
                    <button onClick={() => decrement_post_score(props.id, setScore)}>-</button>
                </div>
            </header>
            <PostContent post={props.post} />
            <div className="post-footer">
                <div>
                    <Link to={`/${props.department_code}/${props.class_code}/`}>
                        <p className="class">{props.department_code} {props.class_code}</p>
                    </Link>
                    <p>{props.post.professor_name ? `Professor ${props.post.professor_name}` : ""}</p>
                </div>
                <p>{new Date(props.post.dt).toLocaleDateString()}</p>
            </div>
        </section>
    )

}

function PostContent(props: { post: Post }) {

    switch(props.post.upload_type) {
        case 0:
            return <PostImage post={props.post} />
        case 1: 
            return <PostPDF post={props.post} /> 
        case 2:
            return <PostText post={props.post} />
        default:
            throw Error();
    }

}

function PostImage(props: { post: Post }) {
    console.log(`${uploads_path}/${props.post.file_name}`);
    return <div className="image">
        {/* <iframe src={`${uploads_path}/${props.post.file_name}`}></iframe> */}
        <img src={`${uploads_path}/${props.post.file_name}`} alt="" />
    </div>
}

function PostPDF(props: { post: Post }) {
    return <div className="pdf">
        <iframe src={`${uploads_path}/${props.post.file_name}`}></iframe>
    </div>;
}

function PostText(props: { post: Post }) {
    return <div className="text">
        <p>{props.post.text}</p>
    </div>;
}

async function getPost(post_id: string, setPost: React.Dispatch<React.SetStateAction<Post | null>>) {

    // return setPost({
    //     title: "My Cat 123",
    //     score: 5,
    //     upload_type: 0,
    //     file_name: "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
    //     dt: "2024-04-20 00:00:00",
    //     professor_name: "Michael Rodgers",
    //     user_id: 2,
    //     username: "jonathansmith",
    // });

    let url: string = `${base_api_url}/post/${post_id}/get_post`;

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

async function increment_post_score(post_id: number | string, setScore: React.Dispatch<React.SetStateAction<number>>) {

    let url: string = `${base_api_url}/post/${post_id}/increment_post_score`;

    let res: Response;

    try {   
        res = await fetch(url, { method: "PUT" });
    } catch(err) {
        return console.log(err);
    }
        
    if(res!.ok === false) {
        return console.log(res.status);
    }

    setScore((score: number) => score + 1);
        
    try {} catch(err) {
        setScore((score: number) => score - 1);
        console.log(err);
    }

}

async function decrement_post_score(post_id: number | string, setScore: React.Dispatch<React.SetStateAction<number>>) {

    let url: string = `${base_api_url}/post/${post_id}/decrement_post_score`;

    let res: Response;

    try {   
        res = await fetch(url, { method: "PUT" });
    } catch(err) {
        return console.log(err);
    }
        
    if(res!.ok === false) {
        return console.log(res.status);
    }
        
    setScore((score: number) => score - 1);
        
    try {} catch(err) {
        setScore((score: number) => score + 1);
        console.log(err);
    }

}