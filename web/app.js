let cncseInit = false;
let nightOwlInit = false;
let hypeInit = false;
let messagesInit = false;
let wordsInit = false;
let emojiInit = false;
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
 
function backClick()// to be done when clicked
    {    
        currentSlide = (currentSlide - 1 + slides.length) % slides.length; // circular logic for changing slides
        showSlide(currentSlide);
    };
function nextClick() // to be done when clicked
    {
        currentSlide = (currentSlide + 1) % slides.length; // circular logic for changing slides
        showSlide(currentSlide);
    };

function KEY(k) 
{
    if (!slides.length) return;
    if (k.key === "ArrowRight") nextClick();
    if (k.key === "ArrowLeft") backClick();
}

function start() {

    slides = document.querySelectorAll(".slide"); // all elements with class = "slide" will be stored in slides 

    const next = document.getElementById("NextButton"); // next stores the element of next button
    const back = document.getElementById("BackButton"); // back stores the element of back button 

    next.addEventListener("click", nextClick); // adds a click event to button
    back.addEventListener("click", backClick); // adds a click event to button
    document.addEventListener("keydown", KEY);

}

function showSlide(index) {
    for (let i = 0; i < slides.length; i++) 
    {
        slides[i].classList.remove("active"); // removes active class from all slides 
        
        if (i == index) 
            slides[i].classList.add("active"); // adds active class to the slide which is to be displayed
    }
    handleSlideChange(index); // what to do when we want show the slide of above index
    document.getElementById("progress").textContent = `${index + 1} / ${slides.length}`;
}

function handleSlideChange(index) {

    if (index == 1 && !messagesInit) 
    {
        createMessagesChart();
        messagesInit=true;
    }

    if (index == 2 && !wordsInit) 
    {
        createWordsChart();
        wordsInit=true;
    }

    if (index == 3) 
    {
        showChatterBox();
    }
    
    if (index == 4)  
    {
        showCncseMsgr();
        if(!cncseInit)
        {
            createCncseChart();
            cncseInit=true;
        }
    }
    
    if (index == 5) 
    {
        showNightOwl();
        if(!nightOwlInit)
        {
            createNightOwlChart();
            nightOwlInit=true;
        }
    }
    
    if (index == 6) 
    {
        showGhost();
    }

    if (index == 7) 
    {
        showHypePerson();
        if(!hypeInit)
        {
            createHypeChart();
            hypeInit=true;
        }
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
    
    if (index == 12 && !emojiInit) 
    {
        createEmojiChart();
        emojiInit=true;
    }
    
    
    if (index == 13 && !profilesInitialized) 
    {
        createProfileButtons();
        profilesInitialized = true;
    }
}


//Messages per user graph
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
            maintainAspectRatio:false,
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

//Words per user graph
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
            maintainAspectRatio:false,
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

//The moncise messager
function showCncseMsgr() {
    const nameEl = document.getElementById("cncse-msgr");
    const infoEl = document.getElementById("cncse-msgr-info");
    const name = data.group_stats.cncse_msgr;
    nameEl.textContent = "\u{1F910} " + name;
    infoEl.textContent ='"Why waste time say lot word when few word do trick?"';
}

//The night owl
function showNightOwl() {
    const nameEl = document.getElementById("night-owl");
    const infoEl = document.getElementById("night-owl-info");

    const name = data.group_stats.night_owl; 
    nameEl.textContent = "\u{1F319}\u{1F989}" + name;

    infoEl.textContent =
        "Most messed up sleep schedule. Most active at ungodly hours.";
}

//The chatterbox
function showChatterBox() {
    const nameEl = document.getElementById("chatter-box");
    const infoEl = document.getElementById("chatter-box-info");
    const name = data.group_stats.chatterbox;
    nameEl.textContent = "\uD83D\uDCE2" + name;
    infoEl.textContent = "Yappa Yappa. Certified Yapper. Peak Unemployment.";
}

//The ghost
function showGhost() {
    const nameEl = document.getElementById("ghost");
    const infoEl = document.getElementById("ghost-info");

    const name = data.group_stats.ghost;

    nameEl.textContent = "\u{1F47B} " + name;

    infoEl.textContent = "Gets ghosted most often \u{1F62D}";
}

//The Busiest Day
function showBusiestDay() {
    const nameEl = document.getElementById("busiest-day");
    const infoEl = document.getElementById("busiest-day-info");

    const day = data.group_stats.busiest_day;

    nameEl.textContent = "\u{1F4C5} " + day;

    infoEl.textContent =
        "Everybody was vibing \u{1F60E}";
}

//The Longest Silence
function showLongestSilence() {
    const timeEl = document.getElementById("longest-silence");
    const infoEl = document.getElementById("silence-info");

    const silence = data.group_stats.longest_silence;

    timeEl.textContent = "\u{1F636} " + silence;

    infoEl.textContent =
        "Quiet... Too Quiet. Where is everyone?";
}

//The convo starter
function showConversationStarter() {
    const nameEl = document.getElementById("conversation-starter");
    const infoEl = document.getElementById("conversation-starter-info");
    const name = data.group_stats.conversation_starter;
    nameEl.textContent = "\u{1F525} " + name;
    infoEl.textContent =
        "Knows how to get the party started.";
}

//The emoji pie chart
function createEmojiChart() {
    const emojis = data.emoji_stats;
    const labels = [];
    const values = [];

    
    for (let emoji in emojis) 
    {
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

//The Hype Person
function showHypePerson() {
    const nameEl = document.getElementById("hype-person");
    const infoEl = document.getElementById("hype-person-info");

    const name = data.group_stats.hype_person;
    nameEl.textContent = "\u26A1 " + name;

    infoEl.textContent = "One of the greatest mysteries of nature how they are always online.";
}

//The Selective Responder (CUSTOM)
function showSelectiveResponder() {
    const nameEl = document.getElementById("selective-responder");
    const infoEl = document.getElementById("selective-responder-info");

    const name = data.group_stats.selective_responder;

    nameEl.textContent = "\u{1F609} " + name;

    infoEl.textContent = 'Always ready to respond to their "Favourite person" \u{1F60F}';
}

//The buttons in the user profile page with each person's name
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

//Enables the buttons to act as a toggle
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
        <p style="font-size:1.25em; color:pink";>Activity Heatmap \u{1F975}</p>
        <div class="heatmap"></div>
    `;

    container.appendChild(card);

    const heatmapDiv = card.querySelector(".heatmap");
    createHeatmap(heatmapDiv, user.activity_heatmap);
    
    shownProfiles.set(name, card);     
    button.classList.add("active");
}

//Making the visual heatmap from the data in data.json
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

        // intensity (0 to 1)
        let intensity = value / max;

        // color scaling
        box.style.backgroundColor = `rgba(204,134,235, ${intensity})`;

        // tooltip
        box.title = `${key}:00 → ${value} messages`;

        container.appendChild(box);
    }
}

//The graph of average words per message to show the difference between cncse_msgr and the others
function createCncseChart() {
    const labels = [], values = [];
    for (let person in data.per_person) {
        const u = data.per_person[person];
        labels.push(person);
        values.push((u.total_words / u.total_messages).toFixed(2));
    }
    new Chart(document.getElementById("cncse-chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Avg words / message",
                data: values,
                backgroundColor: "#ffe72ff0",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" } }
            }
        }
    });
}

//To show the active hours of the Nightowl
function createNightOwlChart() {
    const totals = {};
    for (let h = 0; h < 24; h++) {
        const key = h < 10 ? "0" + h : "" + h;
        totals[key] = 0;
    }
    for (let person in data.per_person) {
        const hm = data.per_person[person].activity_heatmap;
        for (let hour in hm) totals[hour] += hm[hour];
    }
    const labels = Object.keys(totals);
    const values = Object.values(totals);
    const colors = labels.map(h => parseInt(h) <=4 ? "#9552EA" : "#ffe241");

    new Chart(document.getElementById("night-owl-chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Messages",
                data: values,
                backgroundColor: colors,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "white" }, title: { display: true, text: "Hour of day", color: "white" } },
                y: { ticks: { color: "white" } }
            }
        }
    });
}

//To show the avg response time of everyone
function createHypeChart() {
    const arr = [];
    for (let person in data.per_person) {
        arr.push({
            name: person,
            mins: parseFloat(data.per_person[person].avg_response_time_mins)
        });
    }
    arr.sort((a, b) => a.mins - b.mins);  // fastest first

    new Chart(document.getElementById("hype-chart"), {
        type: "bar",
        data: {
            labels: arr.map(x => x.name),
            datasets: [{
                label: "Avg response time (mins)",
                data: arr.map(x => x.mins),
                backgroundColor: "#e1f03b",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "white" } },
                y: { ticks: { color: "white" }, title: { display: true, text: "Minutes", color: "white" } }
            }
        }
    });
}

