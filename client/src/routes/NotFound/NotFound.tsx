import { useNavigate } from "react-router-dom";

export function NotFound(){
    const navigate = useNavigate();
    setTimeout(() => navigate("/"), 1500);
    return (
        <h1>
            Page Not Found, Redirecting to Home Page...
        </h1>
    );
}
