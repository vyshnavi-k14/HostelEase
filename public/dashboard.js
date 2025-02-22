const hostels = [
    { name: "Medha", img: "hostel1.jpg", page: "medha.html?username=USERNAME_PLACEHOLDER", description: "Medha Hostel " },
    { name: "Yamuna", img: "hostel2.jpg", page: "ganga.html?username=USERNAME_PLACEHOLDER", description: "Ganga Hostel" },
    { name: "Sarada", img: "hostel3.jpg", page: "sarada.html?username=USERNAME_PLACEHOLDER", description: "Sarada Hostel " },
    { name: "Vaishnavi", img: "hostel4.jpg", page: "sindhu.html?username=USERNAME_PLACEHOLDER", description: "Sindhu Hostel " },
    { name: "Manasa", img: "hostel5.jpg", page: "manasa.html?username=USERNAME_PLACEHOLDER", description: "Manasa Hostel" }
];

const sliderWrapper = document.getElementById("sliderWrapper");
const sliderDescription = document.getElementById("sliderDescription");
const sliderBackground = document.querySelector(".slider-background");
let currentIndex = 0;

function createSlideElements() {
    hostels.forEach(hostel => {
        const div = document.createElement("div");
        div.className = "slider-item";
        div.innerHTML = `<img src="${hostel.img}" alt="${hostel.name}" onclick="navigateTo('${hostel.page}')">`;
        sliderWrapper.appendChild(div);
    });
    updateSlider();
}

function updateSlider() {
    const items = document.querySelectorAll(".slider-item");
    items.forEach((item, index) => {
        item.classList.remove("active");
        if (index === currentIndex) {
            item.classList.add("active");
        }
    });
    const translateX = -currentIndex * 30;
    sliderWrapper.style.transform = `translateX(${translateX}%)`;
    sliderDescription.textContent = hostels[currentIndex].description;
    sliderBackground.style.backgroundImage = `url(${hostels[currentIndex].img})`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % hostels.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + hostels.length) % hostels.length;
    updateSlider();
}

function navigateTo(page) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('username');

    console.log('Navigating to:', page); // Debugging log
    console.log('Username:', username);  // Debugging log

    if (username) {
        const urlWithUsername = page.replace('USERNAME_PLACEHOLDER', username);
        console.log('URL with username:', urlWithUsername); // Debugging log
        window.location.href = urlWithUsername;
    } else {
        console.log('No username found, redirecting to index.html'); // Debugging log
        window.location.href = "index.html";
    }
}

function toggleProfileMenu() {
    var menu = document.getElementById("profileMenu");
    menu.classList.toggle("show");
}

function logout() {
    window.location.href = "index.html";
}

function setUsername() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('username');

    if (username) {
        document.getElementById('username').textContent = `Welcome, ${username}`;
        document.getElementById('applicationNumber').textContent = `📄 ${username}`;
        document.getElementById('statusLink').href = `status.html?username=${username}`;
    } else {
        window.location.href = "index.html";
    }
}

window.onload = function() {
    setUsername();
    createSlideElements();
}

window.onclick = function(event) {
    if (!event.target.matches('.profile') && !event.target.closest('.profile')) {
        var dropdowns = document.getElementsByClassName("profile-menu");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
}
