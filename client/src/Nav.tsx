import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";

function Nav(): JSX.Element {

    const location = useLocation();
    const pathname: string = location.pathname;

    return (
        <nav>
            <h5> <Link to="/">Gopher<span>Notes</span> </Link></h5>
            <ul> 
                <li className={navActiveClass(pathname, "/")}><Link to="/">Home</Link></li>
                <li className={navActiveClass(pathname, "/post")}><Link to="/post">Post</Link></li>
            </ul>
        </nav>
    )
}

function navActiveClass(current_path: string, path: string): string {

    if(current_path === path) {
        return "active";
    }

    return "";

}

export default Nav
