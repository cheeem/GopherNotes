const form = document.querySelector<HTMLFormElement>("#upload")!; 

type Post = {
    title: string
    x500: string
    img: string
    likes: number
}

getPosts(setPosts);

form.addEventListener("submit", (e: SubmitEvent) => {

    e.preventDefault();

    const action = form.action;
    const enctype = form.enctype;
    const method = form.method;

    const body: FormData = new FormData(form);

    fetch(action, {
        method,
        //headers: { "Content-Type": enctype, },
        body,
    })
        .then((res: Response) => {

            console.log(res.status);

            if(!res.ok) 
                return;

            form.reset();

            getPosts(setPosts);

        })
        .catch((err: Error) => console.log(err));

});

function getPosts(callback: (any: any) => any) {

    fetch("http://127.0.0.1:3000/posts")
        .then((res: Response) => {
            if(res.ok)
                res.json()
                    .then(callback)
                    .catch((err: Error) => console.log(err))
        })
        .catch((err: Error) => console.log(err));

}

function setPosts(posts: ReadonlyArray<Post>) {

    let html = "";

    for(let i = 0; i < posts.length; i++) {
        html += `
            <li>
                <h1> ${posts[i].title} </h1>
                <p> ${posts[i].x500} </p>
                <p> ${posts[i].likes} </p>
                <img src="./public/img/${posts[i].img}" alt="" />
            <li>
        `;
    }
    
    (document.querySelector("#posts") as HTMLUListElement).innerHTML = html;

}