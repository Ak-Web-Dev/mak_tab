const API_KEY = import.meta.env.VITE_NASA_API_KEY;
document.querySelector("#nasa").innerHTML = '<br /><p>Loading...</p>';
document.querySelector("#app").innerHTML = '<div class="spinner-border text-light" id="spinner" role="status"><span class="visually-hidden">Loading...</span></div>';

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`).
then (response => response.json()).then(data => {
    let media;
    const isImage = data.media_type === "image";

    if (isImage) {
        media = `<img src="${data.url}" id="bd" />`;
    } else if (data.url.includes("youtube") || data.url.includes("youtu.be")) {
        media = `<iframe src="${data.url}" id="bd"></iframe>`;
    } else {
        media = `<video src="${data.url}" id="bd" controls></video>`;
    }

    if (isImage) {
        localStorage.setItem('nasa_wallpaper_url', data.hdurl || data.url);
    }

    document.querySelector("#nasa").innerHTML = `
    <div class="row g-4 align-items-center mt-2" data-bs-theme="dark">
        <div class="col-12 col-lg-4 text-center">
            <div class="nasa-media-container mx-auto">${media}</div>
        </div>

        <div class="col-12 col-lg text-start ps-lg-4">
            <h3 class="mb-3"><u>${data.title}</u></h3>
            <p class="text-white" style="line-height: 1.6;">${data.explanation}</p>
            
            <!-- Dynamic NASA Wallpaper Card & Action -->
            <div class="card bg-dark border-secondary mt-3">
              <div class="card-body">
                <h6 class="card-subtitle mb-2 text-warning">⚠️ Quality Notice</h6>
                <p class="card-text small">Wallpaper sync only works smoothly when today's APOD media is a static photograph (not a video or interactive simulation).</p>
                <button 
                  class="btn btn-success btn-sm mt-2" 
                  onclick="setNasaWallpaper()" 
                  ${!isImage ? 'disabled' : ''}>
                  ${isImage ? '✨ Set NASA Photo as Background' : '❌ Disabled (Today is a Video)'}
                </button>
              </div>
            </div>
        </div>
    </div>`;
    document.querySelector("#app").innerHTML = '';
  })
  .catch(err => {
      document.querySelector("#nasa").innerHTML = `<p>Error: ${err.message}</p>`;
  });

window.setNasaWallpaper = function() {
    localStorage.setItem('selected_wallpaper', 'nasa');
    if (typeof window.applyActiveWallpaper === 'function') {
        window.applyActiveWallpaper();
    }
};