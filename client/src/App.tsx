import { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Nav.tsx";
import Home from "./routes/Home/Home.tsx";
import Class from "./routes/Class/Class.tsx";

export default function App() {

    

    return (
        <>
            <Nav /> 
            <main> 
                <Class />
            </main>
        </>
    )
}