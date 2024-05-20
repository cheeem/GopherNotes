import { useState, useEffect } from "react";
import "./Nav.css";

function Nav() {

    

    return (
        <nav>
            <h5> Gopher<span>Notes</span> </h5>
            <ul> 
                <li className="active"><a href="">Home</a></li>
                <li><a href="">Post</a></li>
            </ul>
        </nav>
    )
}

export default Nav
