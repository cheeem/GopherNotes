import "react";
import { useParams, } from "react-router-dom";

export default function Img() {

    const params = useParams();

    const file_name: string = params.file_name!;

}