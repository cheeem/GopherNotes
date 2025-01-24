import { useState, useRef, FormEvent } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { base_api_url } from "../../constants";
import svg_upload from "../../img/Upload.svg";
import "./Upload.css";

type UploadError = {
    status: number,
    field?: string,
    msg: string,
};

export default function Upload() {

    const navigate: NavigateFunction = useNavigate();

    const [upload_type_is_file, setUploadTypeIsFile] = useState(true);
    const [error, setError] = useState<UploadError | null>(null);

    return (
        <article id="upload">
            <form action={`${base_api_url}/upload/upload`} onSubmit={(e: FormEvent<HTMLFormElement>) => upload(e, navigate, setError)}>
                <div className="form-header">
                    <h1>Post to Gopher<span>Notes</span></h1>
                </div>
                <ul>
                    <li>
                        {error && error.field && "department_code".includes(error.field) ? <ErrorMessage error={error} /> : null}
                        <label htmlFor="upload-department-code">Department Code</label>
                        <input id="upload-department-code" type="text" name="department_code"  required />
                    </li>
                    <li>
                        {error && error.field && "class_code".includes(error.field) ? <ErrorMessage error={error} /> : null}
                        <label htmlFor="upload-class-code">Class Code</label>
                        <input id="upload-class-code" type="text" name="class_code" />
                    </li>
                    <li>
                        {error && error.field && error.field === "title" ? <ErrorMessage error={error} /> : null}
                        <label htmlFor="upload-title">Post Title</label>
                        <input id="upload-title" type="text" name="title" />
                    </li>
                    <li className="upload-field">
                        {error && error.field && error.field === "file" && upload_type_is_file ? <ErrorMessage error={error} /> : null}
                        {error && error.field && error.field === "text" && upload_type_is_file === false ? <ErrorMessage error={error} /> : null}
                        <div className="upload-type">
                            <button type="button" className={upload_type_is_file ? "active" : ""} onClick={() => setUploadTypeIsFile(true)}>File</button>
                            <button type="button" className={upload_type_is_file ? "" : "active"} onClick={() => setUploadTypeIsFile(false)}>Text</button>
                        </div>
                        {upload_type_is_file ? 
                            <FileUpload /> : 
                            <textarea className="upload-input" name="text"></textarea>
                        }
                    </li>
                </ul>
                <div className="form-footer">
                    {error && !error.field ? <ErrorMessage error={error} /> : null}
                    <button type="submit">Post to GopherNotes</button>
                </div>
            </form>
        </article>
    )

}

function ErrorMessage(props: { error: UploadError }) {
    return (
        <div className="error-message">
            <p>{props.error.msg}</p>
        </div>
    );
}

function FileUpload() {

    const [file_name, setFileName] = useState<null | string>(null);
    const [file_size, setFileSize] = useState<null | number>(null);
    const file_input = useRef<HTMLInputElement>(null);

    return (
        <button type="button" className="upload-input file-upload" onClick={() => file_input.current!.click()}>
            <input ref={file_input} type="file" name="file" accept=".jpg,.jpeg,.png,.pdf" required 
                onChange={() => {

                    if(file_input.current === null) {
                        return;
                    }

                    if(file_input.current.files == null) {
                        return;
                    }

                    const file = file_input.current.files[0];

                    setFileName(file.name);
                    setFileSize(file.size);

                }} 
            />
            {file_name && file_size ? 
                <p>{file_name} <span>{formatFileSize(file_size)}MB</span></p> : 
                <>
                    <img src={svg_upload} alt="" />
                    <p>Upload File</p>
                    <p><span>16MB Maximum</span></p>
                </>
            }
        </button>
    )

}

function formatFileSize(size: number): number {
    return Math.round(size / 1024 / 1024 * 100) / 100;
}

function upload(e: FormEvent<HTMLFormElement>, navigate: NavigateFunction, setError: React.Dispatch<React.SetStateAction<UploadError | null>>) {

    e.preventDefault();

    // setError(null);

    const form: HTMLFormElement = e.currentTarget;

    const url: string = form.action;
    const data: FormData = new FormData(form);

    fetch(url, {
        method: "POST",
        body: data,
    }).then((res: Response) => {

        if(res.status == 200) {
            navigate("/");
            return;
        }

        if(res.status === 413) {
            setError({
                status: 413,
                field: "file",
                msg: "File Too Large, Uploaded Files Cannot Exceed 16MB"
            })
            return;
        }
            
        res.json()
            .then((error: UploadError) => {
                // console.log(error);
                setError(error);
            })
            .catch(() => {
                setError(defaultUploadError(res.status));
            })
        
    })
    .catch(() => {
        setError(defaultUploadError(NaN));
    })

}

function defaultUploadError(status: number): UploadError {
    return {
        status, 
        msg: "An Unexpected Error Occured, Please Try Again Later"
    }
}