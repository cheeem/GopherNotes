import { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { base_api_url } from "../../constants";
import "./Home.css";
import svg_search from "../../img/Search.svg";

type UMNClass = {
    class_code: string,
    department_code: string,
    name: string,
    post_count: number, 
}

type SearchOption = {
    display: string,
    query: string,
}

// const classes: ReadonlyArray<UMNClass> = [
//     {
//         code: "CSCI 1103",
//         name: "Introduction to Computer Programming in Java",
//         post_count: 50,
//     },
//     {
//         code: "CSCI 2081",
//         name: "Introduction to Software Development",
//         post_count: 123,
//     },
//     {
//         code: "CSCI 3041",
//         name: "Introduction to Discrete Structures and Algorithms",
//         post_count: 123,
//     },
//     {
//         code: "CSCI 2081",
//         name: "Introduction to Software Development",
//         post_count: 87,
//     },
//     {
//         code: "CSCI 3041",
//         name: "Introduction to Discrete Structures and Algorithms",
//         post_count: 87,
//     },
//     {
//         code: "CSCI 1103",
//         name: "Introduction to Computer Programming in Java",
//         post_count: 50,
//     },
// ] as const;

const search_options: ReadonlyArray<SearchOption> = [
    { display: "Class Code", query: "code" },
    { display: "Professor", query: "professor" },
] as const;

const sort_options: ReadonlyArray<string> = [
    "Recently Visited",
    "Popular",
] as const;

export default function Home(): JSX.Element {

    const [classes, setClasses] = useState<UMNClass[] | null>(null);
    const [search_option_active, setSearchOptionActive] = useState(0);
    const [sort_option_active, setSortOptionActive] = useState(0);

    useEffect(() => {
        searchClasses(null, search_option_active, setClasses);
    }, [search_option_active]);
    
    return (
        <article id="home">
            <section className="hero">
                <header>
                    <h1>GopherNotes</h1>
                    <h3>The Best UMN Notes, All in One Place</h3>
                </header>
                <div className="body">
                    <div className="search">
                        <SearchOptions active={search_option_active} setActive={setSearchOptionActive} />
                        <div className="search-input">
                            <img src={svg_search} alt="" />
                            <input type="text" name="input" onChange={(e: ChangeEvent<HTMLInputElement>) => searchClasses(e.target.value || null, search_option_active, setClasses)} />
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
            <section className="courses">
                <SortOptions active={sort_option_active} setActive={setSortOptionActive} />
                <ClassList classes={classes} />
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

function SortOptions(props: { active: number, setActive: React.Dispatch<React.SetStateAction<number>> }): JSX.Element {

    const options: JSX.Element[] = sort_options.map((display: string, index: number) => (
        <button 
            key={index}
            className={optionActiveClass(props.active, index)} 
            onClick={() => props.setActive(index)}
        > {display}
        </button>
    ));

    return (
        <div className="sort-options">
            {options}
        </div>
    )

}

function ClassList(props: { classes: UMNClass[] | null }): JSX.Element | null {
    
    if(props.classes === null) {
        return null; // loading state
    }
    
    return <ul>{props.classes.map(Class)}</ul>;

}

function Class(umn_class: UMNClass, index: number): JSX.Element {
    return (
        <li key={index}>
            <div>
                <div className="desc">
                    <h3> {umn_class.department_code} {umn_class.class_code} </h3>
                    <p> {umn_class.name} </p>
                </div>
                <div className="link">
                    <Link to={`/${umn_class.department_code}/${umn_class.class_code}`}>
                        <p> View All {umn_class.post_count} Posts </p>
                    </Link>
                </div>
            </div>
        </li>
    )
}

function optionActiveClass(active: number, search_option: number): string {
    
    if(active === search_option) {
        return "active"
    }
    
    return "";

}

async function searchClasses(input: string | null, search_option_active: number, setClasses: React.Dispatch<React.SetStateAction<UMNClass[] | null>>) {

    const search_by: string = search_options[search_option_active].query;

    let url: string = `${base_api_url}/home/get_classes_by_${search_by}`;
    
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
        setClasses(await res!.json());
    } catch(err) {
        console.log(err);
    }

}