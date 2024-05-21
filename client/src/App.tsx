import { Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Nav.tsx";
import Home from "./routes/Home/Home.tsx";
import Class from "./routes/Class/Class.tsx";

export default function App(): JSX.Element {

    

    return (
        <>
            <Nav /> 
            <main> 
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:department_code">
                        <Route path=":class_code" element={<Class />} />
                    </Route>
                </Routes>
            </main>
        </>
    )
}