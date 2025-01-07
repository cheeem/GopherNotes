import { useState, useRef, FormEvent } from "react";
import { base_api_url } from "../../constants";
import svg_upload from "../../img/Upload.svg";
import "./Upload.css";

export default function Upload() {

    const [upload_type_is_file, setUploadTypeIsFile] = useState(true);

    return (
        <article id="upload">
            <form action={`${base_api_url}/upload/upload`} onSubmit={upload}>
                <div className="form-header">
                    <h1>Post to Gopher<span>Notes</span></h1>
                </div>
                <ul>
                    <li>
                        <label htmlFor="upload-department-code">Department Code</label>
                        <input id="upload-department-code" type="text" name="department_code"  required />
                    </li>
                    <li>
                        <label htmlFor="upload-class-code">Class Code</label>
                        <input id="upload-class-code" type="text" name="class_code" />
                    </li>
                    <li>
                        <label htmlFor="upload-title">Post Title</label>
                        <input id="upload-title" type="text" name="title" />
                    </li>
                    <li className="upload-field">
                        <div className="upload-type">
                            <button type="button" className={upload_type_is_file ? "active" : ""} onClick={() => setUploadTypeIsFile(true)}>File</button>
                            <button type="button" className={upload_type_is_file ? "" : "active"} onClick={() => setUploadTypeIsFile(false)}>Text</button>
                        </div>
                        {upload_type_is_file ? 
                            <FileUpload /> : 
                            <textarea name="text"></textarea>
                        }
                    </li>
                </ul>
                <div className="form-footer">
                    <button type="submit">Post to GopherNotes</button>
                </div>
            </form>
        </article>
    )

}

function FileUpload() {

    const [file_name, setFileName] = useState<null | string>(null);
    const file_input = useRef<HTMLInputElement>(null);

    return (
        <button type="button" className="file-upload" onClick={() => file_input.current!.click()}>
            <input ref={file_input} type="file" name="files" accept=".jpg,.jpeg,.png,.pdf" required 
                onChange={() => setFileName(file_input.current?.files?.[0].name ?? null)} 
            />
            {file_name ? 
                <p>{file_name}</p> : 
                <>
                    <img src={svg_upload} alt="" />
                    <p>Upload File</p>
                </>
            }
        </button>
    )

}

function upload(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();

    const form: HTMLFormElement = e.currentTarget;

    const url: string = form.action;
    const data: FormData = new FormData(form);

    fetch(url, {
        method: "POST",
        body: data,
    }).then(res => console.log(res.status));

} 