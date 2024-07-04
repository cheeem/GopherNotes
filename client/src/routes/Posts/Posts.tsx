import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Posts.css";
import svg_search from "../../img/Search.svg";
import SortBar from "./components/SortBar";
import Filter from "./components/Filters";
import styled from "styled-components";
import PostsGrid from "./components/PostsGrid";

const StyledApp = styled.div`
//   background-color: #f0f0f0;
  margin: 2% 10% 100px 10%;
  padding: 0 0 100px 0;
`;

const MainContent = styled.div`
align-items: center;
justify-content: flex-start;
background-color: white;
border-radius: 10px;

padding: 20px;
// box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
// overflow: hidden;  // Contain all child elements within this element
`;

type Post = {
    id: number,
    file_type: String,
    path: String,
    dt: String, // TODO: Needs modification
    class_name: String,
    department_name: String, 
    professor_name: String
}

type SearchOption = {
    display: string,
    query: string,
    department_code: string, 
    class_code: string
}

const searchOptions: ReadonlyArray<SearchOption> = [
    { display: "Class Code", query: "code", department_code: "5521", class_code: "CSCI" },
    { display: "Professor", query: "professor", department_code: "5521", class_code: "CSCI"  },
] as const;

async function getPosts(department_code: string | null, class_code: string | null, searchOptionActive: number, setPosts: React.Dispatch<React.SetStateAction<Post[] | null>>) {

    const searchBy: string = searchOptions[searchOptionActive].query;

    let url: string = `http://localhost:3000/home/get_posts_by_classes_and_department`
    
    if(class_code && department_code) {
        url += `?department_code=${department_code}&class_code=${class_code}`
    }

    try {
        
        const res: Response = await fetch(url);
        
        if(res.ok === false) {
            return 
        }
        
        const posts: Post[] = await res.json();
        
        setPosts(posts);

    } catch(_) {}

}


export default function Posts(): JSX.Element {
    // TODO: handle changing sortOptions and SearchOptions

    const params = useParams();
    const department_code: string = params.department_code!;
    const class_code: string = params.class_code!;

    const [posts, setPosts] = useState<Post[] | null>(null);
    const [searchOptionActive, setSearchOptionActive] = useState(0);
    const [sortOptionActive, setSortOptionActive] = useState(0);

    useEffect(() => {
        getPosts(department_code, class_code, searchOptionActive, setPosts);
    }, [sortOptionActive])

    return (
        <>
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
                <Filter />
            </section>

        </article>

        <StyledApp>
        <MainContent>
            <SortBar />
            <PostsGrid posts={posts}/>
            {/* <section className="posts"></section> */}
        </MainContent>
    </StyledApp>
        </>
    )
}
