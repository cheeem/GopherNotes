import { useState, useEffect } from "react";
import "./Home.css";
import svg_search from "../../img/Search.svg";

type Course = {
    code: string,
    name: string,
    post_count: number, 
}

const courses: ReadonlyArray<Course> = [
    {
        code: "CSCI 1103",
        name: "Introduction to Computer Programming in Java",
        post_count: 50,
    },
    {
        code: "CSCI 2081",
        name: "Introduction to Software Development",
        post_count: 123,
    },
    {
        code: "CSCI 3041",
        name: "Introduction to Discrete Structures and Algorithms",
        post_count: 123,
    },
    {
        code: "CSCI 2081",
        name: "Introduction to Software Development",
        post_count: 87,
    },
    {
        code: "CSCI 3041",
        name: "Introduction to Discrete Structures and Algorithms",
        post_count: 87,
    },
    {
        code: "CSCI 1103",
        name: "Introduction to Computer Programming in Java",
        post_count: 50,
    },
] as const;

export default function Home() {

    return (
        <article id="home">
            <section className="hero">
                <header>
                    <h1>GopherNotes</h1>
                    <h3>The Best UMN Notes, All in One Place</h3>
                </header>
                <div className="body">
                    <div className="search">
                        <div className="search-options">
                            <h5> Search By </h5>
                            <button className="active">Class Code</button>
                            <button>Professor</button>
                            <button>Department</button>
                        </div>
                        <div className="search-input">
                            <img src={svg_search} alt="" />
                            <input type="text" name="input" />
                        </div>
                    </div>
                    <div className="or">
                        <p>or</p>
                    </div>
                    <div className="post">
                        <button>Post Your Own Notes</button>
                    </div>
                </div>
            </section>
            <section className="courses">
                <div className="sort-options">
                    <button className="active">Recently Visited</button>
                    <button>Popular</button>
                </div>
                <ul>
                    {courses.map(course => <Course course={course} />)}
                </ul>
            </section>
        </article>
    )
}

function Course({ course }: { course: Course }) {
    return (
        <li>
            <div>
                <div className="desc">
                    <h3> {course.code} </h3>
                    <p> {course.name} </p>
                </div>
                <button>
                    View All {course.post_count} Posts
                </button>
            </div>
        </li>
    )
}