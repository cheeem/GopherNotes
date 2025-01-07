import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Nav.tsx";
import Home from "./routes/Home/Home.tsx";
import Posts from "./routes/Posts/Posts.tsx";
import Upload from "./routes/Upload/Upload.tsx";
import NotFound from "./routes/NotFound/NotFound.tsx";
import PostDetail from "./routes/PostDetail/PostDetail.tsx";
import ProfilePage from "./routes/Profile/ProfilePage.tsx";

export default function App(): JSX.Element {

    
    return (
        <>
            <Nav /> 
            <main> 
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:department_code">
                        <Route path=":class_code" element={<Posts />} />
                    </Route>
                    <Route path="/post/:postId" element={<PostDetail />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/Profile" element={<ProfilePage/>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}
