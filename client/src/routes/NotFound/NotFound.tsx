import { useNavigate } from "react-router-dom";

export default function NotFound() {

    const navigate = useNavigate();
    navigate("/")
    return null;

}