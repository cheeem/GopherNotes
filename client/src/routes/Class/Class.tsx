import { useState, useEffect, ChangeEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { base_api_url, uploads_path } from "../../constants";
import svg_search from "../../img/Search.svg";
import "./Class.css";

type Post = {
    id: number,
    title: string,
    score: number,
    upload_type: number,
    file_name?: string,
    dt: string, 
    text?: string,
    professor_name?: string | null,
    user_id: number,
    username: string,
}

type SearchOption = {
    display: string,
    query: string,
}

const search_options: ReadonlyArray<SearchOption> = [
    { display: "Title", query: "title" },
    { display: "Professor", query: "professor" },
] as const;

export default function Class(): JSX.Element {

    const params = useParams();

    const department_code: string = params.department_code!;
    const class_code: string = params.class_code!;

    const [posts, setPosts] = useState<Post[] | null>(null);
    const [search_option_active, setSearchOptionActive] = useState(0);

    useEffect(() => {
        searchPosts(department_code, class_code, null, search_option_active, setPosts);
    }, [search_option_active])

    console.log(posts)

    return (
        <article id="class">
            <section className="hero">
                <header>
                    <h1>{department_code} {class_code}</h1>
                    <h3>Introduction to Computer Programming in Java</h3>
                </header>
                <div className="body">
                    <div className="search">
                        <SearchOptions active={search_option_active} setActive={setSearchOptionActive} />
                        <div className="search-input">
                            <img src={svg_search} alt="" />
                            <input type="text" name="input" onChange={(e: ChangeEvent<HTMLInputElement>) => searchPosts(department_code, class_code, e.target.value || null, search_option_active, setPosts)} />
                        </div>
                    </div>
                    <div className="or">
                        <p>or</p>
                    </div>
                    <div className="post-yours">
                        <Link to="/upload"><p>Post Your Own Notes</p></Link>
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
                        <Post key={post.id} post={post} department_code={department_code} class_code={class_code} />
                    ))}
                </ul>
            </section>
        </article>
    )
}

function SearchOptions(props: { active: number, setActive: React.Dispatch<React.SetStateAction<number>> }): JSX.Element {

    const options: JSX.Element[] = search_options.map((search_option: SearchOption, index: number) => (
        <button 
            key={index}
            className={optionActiveClass(props.active, index)} 
            onClick={() => props.setActive(index)}
        > {search_option.display}
        </button>
    ));

    return (
        <div className="search-options">
            <h5> Search By </h5>
            {options}
        </div>
    )

}

function Post(props: { post: Post, department_code: string, class_code: string }) {
    return (
        <li className="post">
            <div className="post-header">
                <div>
                    <Link to={`/${props.department_code}/${props.class_code}/post/${props.post.id}`}><p className="title">{props.post.title}</p></Link>
                    <Link to={`/user/${props.post.user_id}`}><p className="username">{props.post.username}</p></Link>
                </div>
                <div className="post-vote">
                    <h5>{props.post.score}</h5>
                    <button>+</button>
                    <button>-</button>
                </div>
            </div>
            <Link to={`/${props.department_code}/${props.class_code}/post/${props.post.id}`}>
                <PostContent post={props.post} />
            </Link>
            <div className="post-footer">
                <div>
                    <p>{props.department_code} {props.class_code}</p>
                    <p>{props.post.professor_name ? `Professor ${props.post.professor_name}` : ""}</p>
                </div>
                <p>{new Date(props.post.dt).toLocaleDateString()}</p>
            </div>
        </li>
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
    return <div className="image">
        <img src={`${uploads_path}${props.post.file_name}`} alt="" />
    </div>
}

function PostPDF(props: { post: Post }) {
    return <div className="pdf">
        <iframe src={`${uploads_path}${props.post.file_name}`}></iframe>
    </div>;
}

function PostText(props: { post: Post }) {
    return <div className="text">
        <p>{props.post.text}</p>
    </div>;
}

function optionActiveClass(active: number, search_option: number): string {
    
    if(active === search_option) {
        return "active"
    }
    
    return "";

}

async function searchPosts(department_code: string | null, class_code: string | null, input: string | null, search_option_active: number, setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>) {

    // setPosts(Array.from({ length: 8, }, (_, i) => ({
    //     id: i+1, 
    //     title: "My Cat 123",
    //     score: 5,
    //     upload_type: 0,
    //     file_name: "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
    //     dt: "2024-04-20 00:00:00",
    //     professor_name: "Michael Rodgers",
    //     user_id: 2,
    //     username: "jonathansmith",
    // }))); return;

    const search_by: string = search_options[search_option_active].query;

    let url: string = `${base_api_url}/class/${department_code}/${class_code}/get_posts_by_${search_by}`;
    
    if(input) {
        url += `?input=${input}`;
    }

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
        setPosts(await res!.json());
    } catch(err) {
        console.log(err);
    }

}