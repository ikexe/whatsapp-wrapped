let data = null; //will store our JSON data
let profilesInitialized = false;
let shownProfiles = new Set(); // Here I have used set to prevent duplicate profiles
let currentSlide = 0; // used to track which slide we are at currently (viewer will see this slide)
let slides = []; // this will store all elements of HTML that act as slides.

fetch('data.json') // Fetched data from server(requesting a file named data.json)
    .then(response => response.json()) // this respnse is then parsed into json format(converts the response to JSON)
    .then(jsonData => { // jsonData contains the javascript object and then data stores it and thne initialize function is called to run our website
        data = jsonData;
        start();// runs start function (at this we are starting our website as data is reached to us)
    })
    .catch(error => console.error('Error fetching JSON', error)); // if some error occurs in fetching or pasing file then it shows error
 

function start() {

    slides = document.querySelectorAll(".slide"); // all elements with class = "slide" will be stored in slides 

    const next = document.getElementById("NextButton"); // next stores the element of next button
    const back = document.getElementById("BackButton"); // back stores the element of back button 

    next.addEventListener("click", nextClick); // adds a click event to button
    function nextClick() // to be done when clicked
    {
        currentSlide = (currentSlide + 1) % slides.length; // circular logic for changing slides
        showSlide(currentSlide);
    };

    back.addEventListener("click", backClick); // adds a click event to button
    function backClick()// to be done when clicked
    {    
        currentSlide = (currentSlide - 1 + slides.length) % slides.length; // circular logic for changing slides
        showSlide(currentSlide);
    };

}

function showSlide(index) {
    for (let i = 0; i < slides.length; i++) 
    {
        slides[i].classList.remove("active"); // removes active class from all slides 
        
        if (i == index) 
            slides[i].classList.add("active"); // adds active class to the slide which is to be displayed
    }
    handleSlideChange(index); // what to do when we want show the slide of above index
}

function handleSlideChange(index) {

    if (index == 1) 
    {
        createMessagesChart();
    }

    if (index == 2) 
    {
        createWordsChart();
    }

    if (index == 3) 
    {
        showNightOwl();
    }

    if (index == 4) 
    {
        showGhost();
    }

    if (index == 5) 
    {
        showBusiestDay();
    }

    if (index == 6) 
    {
        showLongestSilence();
    }
    
    if (index == 7) 
    {
        createEmojiChart();
    }
    
    if (index == 8) 
    {
        showHypePerson();
    }
    
    if (index == 9) 
    {
        showSelectiveResponder();
    }
    
    if (index == 10 && !profilesInitialized) 
    {
        createProfileButtons();
        profilesInitialized = true;
    }
}

function createMessagesChart() {
    const users = data.per_person;
    console.log(users); // checking what it produces
    const labels = [];
    const values = [];

    for (let person in users) 
    {
        console.log(person); // checking what it produces
        labels.push(person);
        values.push(users[person].total_messages);
    }

    const chart_canvas = document.getElementById("messages-chart");

    let messagesChart = new Chart(chart_canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Messages",
                data: values,
                backgroundColor: "#03f0fc",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels:{
                        color: "#fce303"
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    ticks: {
                        color: "white" // white was only visible in my beautiful background
                    }
                }
            }
        }
    });
}

function createWordsChart() {
    const users = data.per_person;

    const labels = [];
    const values = [];

    for (let person in users) {
        labels.push(person);
        values.push(users[person].total_words);
    }

    const word_canvas = document.getElementById("words-chart");

    let wordsChart = new Chart(word_canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Words",
                data: values,
                backgroundColor: "#fce303",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels:{
                        color: "#03f0fc"
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    });
}

function showNightOwl() {
    const nameEl = document.getElementById("night-owl");
    const infoEl = document.getElementById("night-owl-info");

    const name = data.group_stats.night_owl;
    const user = data.per_person[name];

    nameEl.textContent = "🌙 " + name;

    infoEl.textContent =
        "Most active late at night with " +
        user.total_messages +
        " total messages and an average response time of " +
        user.avg_response_time_mins + " mins.";
}

function showGhost() {
    const nameEl = document.getElementById("ghost");
    const infoEl = document.getElementById("ghost-info");

    const name = data.group_stats.ghost;
    const user = data.per_person[name];

    nameEl.textContent = "👻 " + name;

    infoEl.textContent =
        "Often disappears from conversations and replies slowly, with an average response time of " +
        user.avg_response_time_mins +
        " minutes.";
}

function showBusiestDay() {
    const nameEl = document.getElementById("busiest-day");
    const infoEl = document.getElementById("busiest-day-info");

    const day = data.group_stats.busiest_day;

    nameEl.textContent = "📅 " + day;

    infoEl.textContent =
        "This was the most active day in the chat with the highest number of messages exchanged.";
}

function showLongestSilence() {
    const timeEl = document.getElementById("longest-silence");
    const infoEl = document.getElementById("silence-info");

    const silence = data.group_stats.longest_silence;

    timeEl.textContent = "😶 " + silence;

    infoEl.textContent =
        "This was the longest period where the chat went completely silent.";
}

function createEmojiChart() {
    const emojis = data.emoji_stats;
    const labels = [];
    const values = [];

    for (let emoji in emojis) {
        console.log(emoji);
        labels.push(emoji);
        values.push(emojis[emoji]);
    }

    const pie_chart_canvas = document.getElementById("emoji-chart");

    let emojiChart = new Chart(pie_chart_canvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#FFEC21",
                    "#378AFF",
                    "#FFA32F",
                    "#F54F52",
                    "#93F03B",
                    "#9552EA",
                    "#00008B",
                    "#C6D68F",
                    "#E8A09A",
                    "#44FF07",
                    "#FB13F3"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 15
                        }
                    }
                }
            }
        }
    });
}

function showHypePerson() {
    const nameEl = document.getElementById("hype-person");
    const infoEl = document.getElementById("hype-person-info");

    const name = data.group_stats.hype_person;
    const user = data.per_person[name];

    nameEl.textContent = "⚡ " + name;

    infoEl.textContent =
        "Always active and quick to respond, with an average response time of " +
        user.avg_response_time_mins +
        " minutes.";
}

function showSelectiveResponder() {
    const nameEl = document.getElementById("selective-responder");
    const infoEl = document.getElementById("selective-responder-info");

    const name = data.group_stats.selective_responder;
    const user = data.per_person[name];

    nameEl.textContent = "🎯 " + name;

    infoEl.textContent =
        "Chooses when to engage in conversations, with a slower average response time of " +
        user.avg_response_time_mins +
        " minutes.";
}

function createProfileButtons() {
    const container = document.getElementById("profile-buttons");

    for (let person in data.per_person) {
        const button = document.createElement("button");
        button.textContent = person;

        button.addEventListener("click", function () {
            showUserProfile(person);
        });

        container.appendChild(button);
    }
}

function showUserProfile(name) {

    if (shownProfiles.has(name)) 
        return;

    shownProfiles.add(name);

    const container = document.getElementById("user-profile");
    const user = data.per_person[name];

    const card = document.createElement("div");
    card.classList.add("profile-card");

    card.innerHTML = `
        <h3>${name}</h3>
        <p>Messages: ${user.total_messages}</p>
        <p>Words: ${user.total_words}</p>
        <p>Top Emojis: ${user.top3_emojis.join(", ")}</p>
        <p>Avg Response Time: ${user.avg_response_time_mins} mins</p>
        <div class="heatmap"></div>
    `;

    container.appendChild(card);

    const heatmapDiv = card.querySelector(".heatmap");
    createHeatmap(heatmapDiv, user.activity_heatmap);
}

function createHeatmap(container, heatmapData) {
    container.innerHTML = "";

    // finding max value of messages a person has sent to specify maximum value
    let max = 0;
    for (let hour in heatmapData) {
        if (heatmapData[hour] > max) {
            max = heatmapData[hour];
        }
    }

    // created 24 boxess
    for (let i = 0; i < 24; i++) {
        const value = heatmapData[i];

        const box = document.createElement("div");
        box.classList.add("heat-box");

        // intensity (0 to 1) value is always <=1
        let intensity = value / max;

        // color 
        box.style.backgroundColor = `rgba(3, 240, 252, ${intensity})`;

        // when we hove we see
        box.title = `${i}:00 → ${value} messages`;

        container.appendChild(box);
    }
}

