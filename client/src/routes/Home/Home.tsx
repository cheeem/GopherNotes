import { useState, useEffect, useRef, ChangeEvent } from "react";
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

const search_options: ReadonlyArray<SearchOption> = [
    { display: "Class Code", query: "code" },
    { display: "Professor", query: "professor" },
] as const;

export default function Home(): JSX.Element {

    const page = useRef<number>(0);
    const [classes, setClasses] = useState<UMNClass[] | null>(null);
    const [search_option_active, setSearchOptionActive] = useState(0);
    // const [sort_option_active, setSortOptionActive] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const observer = useRef<IntersectionObserver>();

    useEffect(() => {

        observer.current = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    searchClasses(inputRef.current!.value || null, search_option_active, page.current + 1).then(c => {
                        if(c) {
                            page.current++;
                            setClasses((classes) => classes!.concat(c));
                        }
                    });
                }
            });
        });

    }, []);

    useEffect(() => {
        searchClasses(inputRef.current!.value || null, search_option_active, 0).then(c => {
            page.current = 0;
            setClasses(c);
        });
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
                            <input ref={inputRef} type="text" name="input" onChange={(e: ChangeEvent<HTMLInputElement>) => 
                                searchClasses(e.target.value || null, search_option_active, 0).then(c => {
                                    page.current = 0;
                                    setClasses(c);
                                })} />
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
                {/* <SortOptions active={sort_option_active} setActive={setSortOptionActive} /> */}
                <ClassList classes={classes} observer={observer} />
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

// function SortOptions(props: { active: number, setActive: React.Dispatch<React.SetStateAction<number>> }): JSX.Element {

//     const options: JSX.Element[] = sort_options.map((display: string, index: number) => (
//         <button 
//             key={index}
//             className={optionActiveClass(props.active, index)} 
//             onClick={() => props.setActive(index)}
//         > {display}
//         </button>
//     ));

//     return (
//         <div className="sort-options">
//             {options}
//         </div>
//     )

// }

function ClassList(props: { classes: UMNClass[] | null, observer: React.MutableRefObject<IntersectionObserver | undefined> }): JSX.Element | null {

    const nextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(props.observer.current && nextRef.current) {
            props.observer.current!.observe(nextRef.current!);
        }
    }, [props.observer.current, nextRef.current]);
    
    if(props.classes === null) {
        return null; // loading state
    }
    
    return (
        <div>
            <ul>{props.classes.map(Class)}</ul>
            <div className="next" ref={nextRef}></div>
        </div>    
    );

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
                        <p> View {umn_class.post_count === 1 ? `${umn_class.post_count} Post` : `${umn_class.post_count} Posts`} </p>
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

async function searchClasses(input: string | null, search_option_active: number, page: number): Promise<UMNClass[] | null> {

    const search_by: string = search_options[search_option_active].query;

    let url: string = `${base_api_url}/home/get_classes_by_${search_by}?page=${page}`;
    
    if(input) {
        url += `&input=${input}`;
    }

    let res: Response;

    try {   
        res = await fetch(url);
    } catch(err) {
        console.log(err);
        return null;
    }
        
    if(res!.ok === false) {
        console.log(res.status);
        return null;
    }
        
    try {
        return await res!.json();
    } catch(err) {
        console.log(err);
        return null;
    }

}