let data = null; //will store our JSON data
let profilesInitialized = false;
let shownProfiles = new Map(); // Here I have used set to prevent duplicate profiles
let currentSlide = 0; // used to track which slide we are at currently (viewer will see this slide)
let slides = []; // this will store all elements of HTML that act as slides.

fetch('../data.json') // Fetched data from server(requesting a file named data.json)
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
        showChatterBox();
    }
    
    if (index == 4)  
    {
        showCncseMsgr();
    }
    
    if (index == 5) 
    {
        showNightOwl();
    }
    
    if (index == 6) 
    {
        showGhost();
    }

    if (index == 7) 
    {
        showHypePerson();
    }

    if (index == 8) 
    {
        showConversationStarter();
    }

    if (index == 9) 
    {
        showSelectiveResponder();
    }

    if (index == 10) 
    {
        showBusiestDay();
    }

    if (index == 11) 
    {
        showLongestSilence();
    }
    
    if (index == 12) 
    {
        createEmojiChart();
    }
    
    
    if (index == 13 && !profilesInitialized) 
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
                backgroundColor: "#ffe241",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
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
                backgroundColor: "#c7a6d3",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
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

function showCncseMsgr() {
    const nameEl = document.getElementById("cncse-msgr");
    const infoEl = document.getElementById("cncse-msgr-info");
    const name = data.group_stats.cncse_msgr;
    const user = data.per_person[name];
    const avg = (user.total_words / user.total_messages).toFixed(1);
    nameEl.textContent = "🤐 " + name;
    infoEl.textContent ='"Why waste time say lot word when few word do trick?"';
}

function showNightOwl() {
    const nameEl = document.getElementById("night-owl");
    const infoEl = document.getElementById("night-owl-info");

    const name = data.group_stats.night_owl;
    const user = data.per_person[name];

    nameEl.textContent = "🌙🦉" + name;

    infoEl.textContent =
        "Most messed up sleep schedule. Most active at ungodly hours.";
}

function showChatterBox() {
    const nameEl = document.getElementById("chatter-box");
    const infoEl = document.getElementById("chatter-box-info");

    const name = data.group_stats.chatterbox;
    const user = data.per_person[name];

    nameEl.textContent = "📢" + name;

    infoEl.textContent = "Yappa Yappa. Certified Yapper. Peak Unemployment.";
}

function showGhost() {
    const nameEl = document.getElementById("ghost");
    const infoEl = document.getElementById("ghost-info");

    const name = data.group_stats.ghost;
    const user = data.per_person[name];

    nameEl.textContent = "👻 " + name;

    infoEl.textContent = "Gets ghosted most often ಥ_ಥ";
}

function showBusiestDay() {
    const nameEl = document.getElementById("busiest-day");
    const infoEl = document.getElementById("busiest-day-info");

    const day = data.group_stats.busiest_day;

    nameEl.textContent = "📅 " + day;

    infoEl.textContent =
        "Everybody was vibing 😎";
}

function showLongestSilence() {
    const timeEl = document.getElementById("longest-silence");
    const infoEl = document.getElementById("silence-info");

    const silence = data.group_stats.longest_silence;

    timeEl.textContent = "😶 " + silence;

    infoEl.textContent =
        "Quiet... Too Quiet. Where is everyone?";
}

function showConversationStarter() {
    const nameEl = document.getElementById("conversation-starter");
    const infoEl = document.getElementById("conversation-starter-info");
    const name = data.group_stats.conversation_starter;
    nameEl.textContent = "🔥 " + name;
    infoEl.textContent =
        "Knows how to get the party started.";
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
                ],
                borderColor:"#000",
                borderWidth:2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size:15
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

    infoEl.textContent = "One of the greatest mysteries of nature how they are always online.";
}

function showSelectiveResponder() {
    const nameEl = document.getElementById("selective-responder");
    const infoEl = document.getElementById("selective-responder-info");

    const name = data.group_stats.selective_responder;
    const user = data.per_person[name];

    nameEl.textContent = "😉 " + name;

    infoEl.textContent = 'Always ready to respond to their "Favourite person" 😏';
}

function createProfileButtons() {
    const container = document.getElementById("profile-buttons");

    for (let person in data.per_person) {
        const button = document.createElement("button");
        button.textContent = person;

        button.addEventListener("click", function () {
            toggleUserProfile(person,button);
        });

        container.appendChild(button);
    }
}

function toggleUserProfile(name,button) {

    if (shownProfiles.has(name)) 
    {
        shownProfiles.get(name).remove();
        shownProfiles.delete(name);
        button.classList.remove("active");
        return;
    }

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
        <br>
        <p style="font-size:1.25em; color:pink";>Activity Heatmap 🥵</p>
        <div class="heatmap"></div>
    `;

    container.appendChild(card);

    const heatmapDiv = card.querySelector(".heatmap");
    createHeatmap(heatmapDiv, user.activity_heatmap);
    
    shownProfiles.set(name, card);     
    button.classList.add("active");
}

function createHeatmap(container, heatmapData) {
    container.innerHTML = "";

    // find max value for scaling
    let max = 0;
    for (let hour in heatmapData) {
        if (heatmapData[hour] > max) {
            max = heatmapData[hour];
        }
    }

    // create 24 boxes
    for (let i = 0; i < 24; i++) {

        let key = i < 10 ? "0" + i : "" + i;
        let value = heatmapData[key];

        const box = document.createElement("div");
        box.classList.add("heat-box");

        // intensity (0 → 1)
        let intensity = value / max;

        // color scaling
        box.style.backgroundColor = `rgba(204,134,235, ${intensity})`;

        // tooltip
        box.title = `${key}:00 → ${value} messages`;

        container.appendChild(box);
    }
}

