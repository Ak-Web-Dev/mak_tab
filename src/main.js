const API_KEY = import.meta.env.VITE_NASA_API_KEY;
document.querySelector("#app").innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
document.querySelector("#nasa").innerHTML = '<br /><p>Loading...</p>';

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
    ${media}`;
    document.querySelector("#nasa").innerHTML = `
    <br /><h3><u>${data.title}</u></h3>
    <p>${data.explanation}</p>
    `;

})
.catch(err => {
    document.querySelector("#app").innerHTML = `<p>Error: ${err.message}</p>`;
})