const API_KEY = "a7ad38d32006166e986c4fb06b021db2"; // Replace with your OpenWeather API key

const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const errorMessage = document.getElementById("errorMessage");

let cache = {}; // Cache last searched result

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) return;

    errorMessage.textContent = "";
    weatherCard.style.display = "none";

    // Check cache first
    if (cache[city]) {
        displayWeather(cache[city]);
        return;
    }

    loader.style.display = "block";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("City not found (404)");
                } else {
                    throw new Error("Server error (" + response.status + ")");
                }
            }
            return response.json();
        })
        .then(data => {
            loader.style.display = "none";
            cache[city] = data; // Store in cache
            displayWeather(data);
        })
        .catch(error => {
            loader.style.display = "none";
            errorMessage.textContent = error.message;
        });
}

function displayWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = 
        "Temperature: " + data.main.temp + " °C";
    document.getElementById("humidity").textContent = 
        "Humidity: " + data.main.humidity + " %";
    document.getElementById("condition").textContent = 
        "Condition: " + data.weather[0].description;

    weatherCard.style.display = "block";
}
