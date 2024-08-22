import { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
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

const searchOptions: ReadonlyArray<SearchOption> = [
    { display: "Class Code", query: "code" },
    { display: "Professor", query: "professor" },
] as const;

const sortOptions: ReadonlyArray<string> = [
    "Recently Visited",
    "Popular",
] as const;

export default function Home(): JSX.Element {

    const [classes, setClasses] = useState<UMNClass[] | null>(null);
    const [searchOptionActive, setSearchOptionActive] = useState(0);
    const [sortOptionActive, setSortOptionActive] = useState(0);

    useEffect(() => {
        searchClasses(null, searchOptionActive, setClasses);
    }, [searchOptionActive]);
    
    return (
        <article id="home">
            <section className="hero">
                <header>
                    <h1>GopherNotes</h1>
                    <h3>The Best UMN Notes, All in One Place</h3>
                </header>
                <div className="body">
                    <div className="search">
                        <SearchOptions active={searchOptionActive} setActive={setSearchOptionActive} />
                        <div className="search-input">
                            <img src={svg_search} alt="" />
                            <input type="text" name="input" onChange={(e: ChangeEvent<HTMLInputElement>) => searchClasses(e.target.value || null, searchOptionActive, setClasses)} />
                        </div>
                    </div>
                    <div className="or">
                        <p>or</p>
                    </div>
                    <div className="post">
                        <Link to="/post"><p>Post Your Own Notes</p></Link>
                    </div>
                </div>
            </section>
            <section className="courses">
                <SortOptions active={sortOptionActive} setActive={setSortOptionActive} />
                <ClassList classes={classes} />
            </section>
        </article>
    )
}

function SearchOptions(props: { active: number, setActive: React.Dispatch<React.SetStateAction<number>> }): JSX.Element {

    const options: JSX.Element[] = searchOptions.map((searchOption: SearchOption, index: number) => (
        <button 
            key={index}
            className={optionActiveClass(props.active, index)} 
            onClick={() => props.setActive(index)}
        > {searchOption.display}
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

    const options: JSX.Element[] = sortOptions.map((display: string, index: number) => (
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

function optionActiveClass(active: number, searchOption: number): string {
    
    if(active === searchOption) {
        return "active"
    }
    
    return "";

}

async function searchClasses(input: string | null, searchOptionActive: number, setClasses: React.Dispatch<React.SetStateAction<UMNClass[] | null>>) {

    const searchBy: string = searchOptions[searchOptionActive].query;

    let url: string = `http://localhost:3000/home/get_classes_by_${searchBy}`
    
    if(input) {
        url += `?input=${input}`
    }

    try {
        
        const res: Response = await fetch(url);
        
        if(res.ok === false) {
            return 
        }
        
        const classes: UMNClass[] = await res.json();
        
        setClasses(classes);

    } catch(_) {}

}