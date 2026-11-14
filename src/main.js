
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

document.querySelector("#nasa").innerHTML = '<br /><p>Loading...</p>';

document.querySelector("#app").innerHTML = `
    <div class="spinner-border text-light" id="spinner" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
`;

// New NASA APOD API endpoint
fetch(`https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=${API_KEY}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`NASA API error: ${response.status}`);
        }

        return response.json();
    })
    .then(responseData => {

        // Handle either a single object or an array of entries
        const data = Array.isArray(responseData)
            ? responseData[0]
            : responseData;

        if (!data) {
            throw new Error("No APOD data received.");
        }

        let media;

        const isImage = data.media_type === "image";
        const hasImage = isImage && Boolean(data.hdurl);

        // Display today's APOD media
        if (hasImage) {
            media = `
                <img
                    src="${data.hdurl}"
                    id="bd"
                    alt="${data.alt || data.title}"
                />
            `;

            // Save the actual image URL for the NASA wallpaper
            localStorage.setItem("nasa_wallpaper_url", data.hdurl);

        } else {
            // Video, iframe, or unavailable image
            media = `
                <div class="text-white text-center p-3">
                    <p>Today's APOD is not available as a photograph.</p>
                    <a
                        href="${data.permalink || data.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-outline-light btn-sm">
                        View on NASA
                    </a>
                </div>
            `;
        }

        // Display NASA information
        document.querySelector("#nasa").innerHTML = `
            <div class="row g-4 align-items-center mt-2" data-bs-theme="dark">

                <div class="col-12 col-lg-4 text-center">
                    <div class="nasa-media-container mx-auto">
                        ${media}
                    </div>
                </div>

                <div class="col-12 col-lg text-start ps-lg-4">

                    <h3 class="mb-3">
                        <u>${data.title}</u>
                    </h3>

                    <p class="text-white" style="line-height: 1.6;">
                        ${data.explanation}
                    </p>

                    <!-- Dynamic NASA Wallpaper Card & Action -->
                    <div class="card bg-dark border-secondary mt-3">
                        <div class="card-body">

                            <h6 class="card-subtitle mb-2 text-warning">
                                ⚠️ Quality Notice
                            </h6>

                            <p class="card-text small">
                                Wallpaper sync only works smoothly when
                                today's APOD media is a static photograph
                                (not a video or interactive simulation).
                            </p>

                            <button
                                class="btn btn-success btn-sm mt-2"
                                onclick="setNasaWallpaper()"
                                ${!hasImage ? "disabled" : ""}>

                                ${hasImage
                                    ? "✨ Set NASA Photo as Background"
                                    : "❌ Disabled (No Photo Available)"}

                            </button>

                        </div>
                    </div>

                </div>
            </div>
        `;

        // Remove the loading spinner
        document.querySelector("#app").innerHTML = "";

        // Refresh wallpaper if NASA is currently selected
        if (localStorage.getItem("selected_wallpaper") === "nasa") {
            window.applyActiveWallpaper?.();
        }

    })
    .catch(err => {

        document.querySelector("#nasa").innerHTML = `
            <p>Error loading NASA APOD: ${err.message}</p>
        `;

        document.querySelector("#app").innerHTML = "";

    });


// NASA wallpaper selection function
window.setNasaWallpaper = function() {

    localStorage.setItem("selected_wallpaper", "nasa");

    if (typeof window.applyActiveWallpaper === "function") {
        window.applyActiveWallpaper();
    }

};
