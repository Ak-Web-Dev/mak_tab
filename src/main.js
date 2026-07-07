const API_KEY = import.meta.env.VITE_NASA_API_KEY;
document.querySelector("#app").innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`).
then (response => response.json()).then(data => {
    let media;
    if(data.media_type === "image") {
        media = `<img src="${data.url}" id="bd" />`;
    } else if (data.url.includes("youtube") || data.url.includes("youtu.be")) {
        media = `<iframe src="${data.url}" id="bd"></iframe>`
    } else {
        media = `<video src="${data.url}" id="bd"controls></video>`;
    }
    document.querySelector("#app").innerHTML = `
    ${media}
    <h1>${data.title}</h1>
    <p>${data.explanation}</p>
    <div class="alert alert-dark" role="alert">
        <p>This is going to have all the Main stuff here!</p>
    </div>`;
})
.catch(err => {
    document.querySelector("#app").innerHTML = `<p>Error: ${err.message}</p>`;
})