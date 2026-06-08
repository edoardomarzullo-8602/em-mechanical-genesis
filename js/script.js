
const questions = [
    {
        text: "What is your relationship with time?",
        options: [
            { label: "It's a challenge to conquer", type: "Pilot" },
            { label: "It's an ocean to explore",    type: "Diver" },
            { label: "It's a ritual to honor",      type: "Dress" }
        ]
    },
    {
        text: "The perfect material for a case is...",
        options: [
            { label: "Technological Titanium", type: "Pilot" },
            { label: "Indestructible Steel",   type: "Diver" },
            { label: "Noble Rose Gold",        type: "Dress" }
        ]
    },
    {
        text: "In 50 years, your watch will be...",
        options: [
            { label: "A legend of engineering",      type: "Pilot" },
            { label: "A witness of your adventures", type: "Diver" },
            { label: "A family heirloom in a safe",  type: "Dress" }
        ]
    },
    {
        text: "Which complication truly matters?",
        options: [
            { label: "High-Beat Chronograph",       type: "Pilot" },
            { label: "Unidirectional Bezel",        type: "Diver" },
            { label: "Pure Minimalism (Time Only)", type: "Dress" }
        ]
    },
    {
        text: "Choose your Sunday environment:",
        options: [
            { label: "A vintage car race",          type: "Pilot" },
            { label: "A boat on the coast",         type: "Diver" },
            { label: "A formal dinner in the city", type: "Dress" }
        ]
    }
];

const profiles = {
    Pilot: {
        name: "THE TECHNICIAN",
        desc: "You seek the peak of mechanical performance. Like the Zenith El Primero, your soul beats at 36,000 vibrations per hour. Precision is your only religion.",
        img: "./img/pilot.png"
    },
    Diver: {
        name: "THE EXPLORER",
        desc: "You need a tool that breathes under pressure. The Rolex Submariner is your shadow: silent, tough, and ready for the abyss. Reliability is your luxury.",
        img: "./img/diver.png"
    },
    Dress: {
        name: "THE PURIST",
        desc: "You believe that true elegance is invisible to the masses. Like the JLC Reverso, your style is a secret shared only with those who know. Less is more.",
        img: "./img/dress.png"
    }
};


let currentQuestion = 0;
let scores = { Pilot: 0, Diver: 0, Dress: 0 };

function initQuiz() {
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];

    document.getElementById("question-text").innerText = q.text;

    const container = document.getElementById("options-container");
    container.innerHTML = "";

    q.options.forEach(function(option) {
        const btn = document.createElement("button");
        btn.innerText = option.label;
        btn.className = "btn btn-outline-light font-unbounded p-3 m-2 small";
        btn.onclick = function() {
            scores[option.type]++;
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                const winner = getWinner();
                saveProfile(winner);
                showResult(winner);
            }
        };
        container.appendChild(btn);
    });
}

function getWinner() {
    let winner = "Pilot";
    for (let type in scores) {
        if (scores[type] > scores[winner]) {
            winner = type;
        }
    }
    return winner;
}

function showResult(profileKey) {
    document.getElementById("question-box").classList.add("d-none");
    document.getElementById("result-box").classList.remove("d-none");

    const profile = profiles[profileKey];
    document.getElementById("archetype-name").innerText = profile.name;
    document.getElementById("archetype-desc").innerText = profile.desc;
    document.getElementById("archetype-img").src = profile.img;
}


function saveProfile(profileKey) {
    if (getConsent() === false) return;

    const days = 30;
    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    document.cookie = "watchProfile=" + profileKey + "; expires=" + expires.toUTCString() + "; path=/";
}


function getProfile() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("watchProfile=")) {
            return cookie.split("=")[1];
        }
    }
    return null;
}

function getVisitCount() {
    
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("visitCount=")) {
            return parseInt(cookie.split("=")[1]);
        }
    }
    return 0; 
}

function incrementVisitCount() {
    const count = getVisitCount() + 1;
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie = "visitCount=" + count + "; expires=" + expires.toUTCString() + "; path=/";
    return count;
}

function personalizeHomepage() {
    const welcome = document.getElementById("welcome-message");
    if (!welcome) return; 

    const profile = getProfile();
    const visits = incrementVisitCount(); 

    if (visits === 1) {
        welcome.innerText = "Discover your mechanical DNA.";
    } else if (visits === 2) {
        welcome.innerText = "Good to see you again.";
    } else {
        if (profile === "Pilot") {
            welcome.innerText = "Welcome back, Technician. Precision never rests.";
        } else if (profile === "Diver") {
            welcome.innerText = "Welcome back, Explorer. The deep awaits.";
        } else if (profile === "Dress") {
            welcome.innerText = "Welcome back, Purist. Elegance is eternal.";
        } else {
            welcome.innerText = "You keep coming back. Take the test and find your match.";
        }
    }
}



function getConsent() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("cookieConsent=")) {
            return cookie.split("=")[1] === "true";
        }
    }
    return false;
}

function acceptCookies() {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie = "cookieConsent=true; expires=" + expires.toUTCString() + "; path=/";
    document.getElementById("cookie-banner").style.display = "none";
}

function showCookieBanner() {
    if (getConsent() === false) {
        document.getElementById("cookie-banner").style.display = "flex";
    }
}

function getABVersion() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("abTest=")) {
            return cookie.split("=")[1];
        }
    }
    return null; 
}

function assignABVersion() {
    const version = Math.random() < 0.5 ? "A" : "B";

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = "abTest=" + version + "; expires=" + expires.toUTCString() + "; path=/";

    return version;
}

function applyABTest() {
    const hero = document.getElementById("hero-title");
    if (!hero) return; 
    let version = getABVersion();
    if (version === null) {
        version = assignABVersion();
    }

    if (version === "A") {
        hero.innerHTML = "MECHANICAL<br>GENESIS";
    } else {
        hero.innerHTML = "DISCOVER<br>YOUR DNA";
    }
}


document.addEventListener("DOMContentLoaded", function() {
    showCookieBanner();
    applyABTest();

    if (document.getElementById("question-text")) {
        initQuiz();
    }

    personalizeHomepage();
    personalizeCards();
    showProfileBox();
});


const profileRecommended = {
    Pilot: ["card-speedmaster", "card-santos"],
    Diver: ["card-submariner",  "card-fiftyf"],
    Dress: ["card-reverso",     "card-breguet"]
};

function personalizeCards() {
    const profile = getProfile();
    if (profile === null) return; 

    const recommended = profileRecommended[profile];

    recommended.forEach(function(cardId) {
        const card = document.getElementById(cardId);
        if (!card) return;

        card.style.borderColor = "var(--gold)";
        card.style.boxShadow = "0 0 20px rgba(179, 148, 89, 0.2)";

        const tag = document.createElement("p");
        tag.className = "font-unbounded";
        tag.style.cssText = "font-size:0.6rem; letter-spacing:3px; color:var(--gold); margin:0 0 12px 0;";
        tag.innerText = "RECOMMENDED FOR YOU";

       
        const cardContent = card.querySelector(".card-content");
        cardContent.insertBefore(tag, cardContent.firstChild);
    });
}


function showProfileBox() {
    const profile = getProfile();
    const box = document.getElementById("profile-box");

    if (!box) return; 
    if (profile === null) {
        box.style.display = "none";
        return;
    }

    box.style.display = "flex";
    document.getElementById("profile-box-name").innerText = profiles[profile].name;
}


function subscribeNewsletter() {
    const input = document.getElementById("newsletter-input");
    const confirm = document.getElementById("newsletter-confirm");
    const form = document.getElementById("newsletter-form");

    if (input.value.trim() === "") {
        input.style.borderColor = "red";
        return;
    }

    const profile = getProfile();

    if (profile === "Pilot") {
        confirm.innerText = "✓ CALIBRATED AND CONFIRMED, TECHNICIAN.";
    } else if (profile === "Diver") {
        confirm.innerText = "✓ WELCOME ABOARD, EXPLORER.";
    } else if (profile === "Dress") {
        confirm.innerText = "✓ WELCOME TO THE INNER CIRCLE, PURIST.";
    } else {
        confirm.innerText = "✓ YOU'RE ON THE LIST.";
    }

    form.style.display = "none";
    confirm.style.display = "block";

    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie = "newsletter=true; expires=" + expires.toUTCString() + "; path=/";
}