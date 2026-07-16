function calculate(op) {
    let num1 = parseFloat(document.getElementById('num1').value);
    let num2 = parseFloat(document.getElementById('num2').value);
    let result;
    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*') result = num1 * num2;
    else if (op === '/') result = num1 / num2;
    document.getElementById('calcResult').innerText = 'Result: ' + result;
}

function updateClock() {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const timeString = now.toLocaleTimeString([], options);
  document.getElementById('clock').textContent = timeString;
}
updateClock();
setInterval(updateClock, 1000);

async function getLocalWeather() {
  const display = document.getElementById('weather-data');
  const savedPostal = localStorage.getItem('saved_postal_code');

  if (!savedPostal || savedPostal.trim() === "") {
    display.textContent = "No postal code";
    return;
  }

  display.textContent = `Loading weather for ${savedPostal}...`;

  try {
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(savedPostal)}&format=json&limit=1&addressdetails=1`, {
      headers: { 'User-Agent': 'MAK-Tab-Dashboard-App' }
    });
    
    if (!geoResponse.ok) throw new Error("Geocoding service error");
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      display.textContent = "Invalid postal code";
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;
    
    const addr = geoData[0].address;
    let cityName = addr.city || addr.town || addr.municipality || addr.village || addr.suburb || addr.county;

    if (!cityName || /^\d+$/.test(cityName.trim())) {
      const parts = geoData[0].display_name.split(',');
      const realNamePart = parts.find(part => !/^\d+$/.test(part.trim()));
      cityName = realNamePart ? realNamePart.trim() : savedPostal.split(',')[0].trim();
    }

    // Professional Clean Up: Strips out administrative suffixes case-insensitively
    cityName = cityName.replace(/\b(tehsil|district|county|municipality|city)\b/gi, '').trim();

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);
    if (!weatherResponse.ok) throw new Error("Weather service error");
    
    const weatherData = await weatherResponse.json();
    const temp = weatherData.current.temperature_2m;
    const unit = weatherData.current_units.temperature_2m;

    display.textContent = `${temp}${unit} (${cityName})`;

  } catch (error) {
    display.textContent = `Unable to retrieve weather data.`;
    console.error(error);
  }
}

function savePostalCode() {
  const postalCode = document.getElementById('postalCodeInput').value;
  localStorage.setItem('saved_postal_code', postalCode);
}
function loadSavedPostalCode() {
  const savedPostal = localStorage.getItem('saved_postal_code');
  const inputField = document.getElementById('postalCodeInput');
  if (inputField.value && savedPostal) {
    inputField.value = savedPostal;
  }
}

const defaultShortcuts = {
  1: {name: "Github", url: "https://github.com"},
  2: {name: "Youtube", url: "https://youtube.com"},
  3: {name: "Gemini", url: "https://gemini.google.com"},
  4: {name: "Gmail", url: "https://mail.google.com"},
  5: {name: "None", url: ""},
}

function saveShortcut(id) {
  const nameVal = document.getElementById(`name${id}`).value.trim();
  const urlVal = document.getElementById(`url${id}`).value.trim();
  if (urlVal && !/https?:\/\//i.test(urlVal)) {
    urlVal = 'https://' + urlVal;
    document.getElementById(`url${id}`).value = urlVal;
  }

  const shortcutData = {name: nameVal, url: urlVal};
  localStorage.setItem(`shortcut_${id}` , JSON.stringify(shortcutData));
}

function updateShortcutsDOM(id, name, url) {
  const btn = document.getElementById(`btn${id}`);
  if (btn) {
    btn.textContent = name || `Btn ${id}`;
    btn.href = url || "#";
  }
}

function loadShortcuts() {
  for (let id = 1; id <= 5; id++) {
    const savedData = localStorage.getItem(`shortcut_${id}`);
    let shortcut;
    if (savedData) {
      shortcut = JSON.parse(savedData);
    } else {
      shortcut = defaultShortcuts[id];
    }

    const nameInput = document.getElementById(`name${id}`);
    const urlInput = document.getElementById(`url${id}`);
    if (nameInput) nameInput.value = shortcut.name;
    if (urlInput) urlInput.value = shortcut.url;

    updateShortcutsDOM(id, shortcut.name, shortcut.url)
  }
}

const wallpaperExtensions = {
  'bd1': 'jpg',
  'bd2': 'jpg',
  'bd3': 'png',
  'bd4': 'jpg',
  'bd5': 'jpg'
};

function getWallpaperUrl(baseName) {
  const isMobile = window.innerWidth <= 1024;
  const ext = wallpaperExtensions[baseName] || 'jpg';
  const suffix = isMobile ? '-m' : '';
  
  // This syntax tells Vite exactly how to resolve the dynamic path at runtime
  return new URL(`./assets/${baseName}${suffix}.${ext}`, import.meta.url).href;
}

function applyActiveWallpaper() {
  const activeBg = localStorage.getItem('selected_wallpaper') || 'bd1';
  let url;

  if (activeBg === 'nasa') {
    url = localStorage.getItem('nasa_wallpaper_url');
  } else {
    url = getWallpaperUrl(activeBg);
  }
  if (url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
  }
}

function selectWallpaper(baseName) {
  localStorage.setItem('selected_wallpaper', baseName);
  applyActiveWallpaper();
}

window.addEventListener('resize', applyActiveWallpaper);
window.addEventListener('resize', applyActiveWallpaper);


window.addEventListener('DOMContentLoaded', () => {
  const greetings = [
    "What's on Your Mind Today?",
    "Search Ahead!",
    "Your Lead.",
    "Greetings..."
  ];
  const randomIndex = Math.floor(Math.random() * greetings.length);
  document.getElementById('greeting').textContent = greetings[randomIndex];

  getLocalWeather();
  loadSavedPostalCode();
  loadShortcuts();
  applyActiveWallpaper();
});

window.calculate = calculate;
window.savePostalCode = savePostalCode;
window.saveShortcut = saveShortcut;
window.selectWallpaper = selectWallpaper;
window.applyActiveWallpaper = applyActiveWallpaper;