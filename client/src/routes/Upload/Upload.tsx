import { FormEvent } from "react";
import { base_api_url } from "../../constants";

export default function Upload() {

    return (
        <form action={`${base_api_url}/upload/upload`} onSubmit={upload_file}>
            <div>
                <label htmlFor="">departmenrt_code</label>
                <input type="text" name="department_code" />
            </div>
            <div>
                <label htmlFor="">class_code</label>
                <input type="text" name="class_code" />
            </div>
            <div>
                <label htmlFor="">title</label>
                <input type="text" name="title" />
            </div>
            <div>
                <label htmlFor="">text</label>
                <textarea name="text"></textarea>
            </div>
            {/* <div>
                <label htmlFor="">file</label>
                <input type="file" name="file" />
            </div> */}
            <button type="submit">Upload</button>
        </form>
    )

}

function upload_file(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();

    const form: HTMLFormElement = e.currentTarget;

    const url: string = form.action;
    const data: FormData = new FormData(form);

    fetch(url, {
        method: "POST",
        body: data,
    }).then(res => console.log(res.status));

} 