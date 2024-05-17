import { useState, useEffect } from "react";
import "./Class.css";
import svg_search from "../../img/Search.svg";

export default function Class() {

    return (
        <article id="class">
            <section className="hero">
                <header>
                    <h1>CSCI 1103</h1>
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
            <section>
                <ul>
                    
                </ul>
            </section>
        </article>
    )
}