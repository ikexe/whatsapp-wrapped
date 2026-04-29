# WhatsApp Wrapped
CS108 project for Spring 2026.

This project involves building a browser-based, Spotify Wrapped-style slideshow that visualises social dynamics found in a WhatsApp group chat. The system has three parts: a Python chat generator, a Python statistics parser, and a JavaScript front-end. Python and JavaScript communicate solely through a JSON file that you design.

## Team Members
- Abhinav Verma — 25B1027
- Ishan Kumar — 25B1074

## System Pipeline
```
vocabulary.txt → chat.py → chat.txt → analyze.py → data.json → app.js → Browser
```

## Directory Structure
```
whatsapp-wrapped/
├── generator/
│   └── chat.py
├── parser/
│   └── analyze.py
├── web/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── chart.umd.js
│   ├── background.png
│   ├── arrow-left.svg
│   └── arrow-right.svg
├── report/
|   ├── report.pdf
│   ├── report.tex
│   ├── Makefile
│   ├── FIRST_SLIDE.png
│   |── LAST_SLIDE.png
|   └── refernces.bib
├── vocabulary.txt
├── chat.txt
├── data.json
├── README.md
└── .gitignore
```

## Tech Tools
- Python
- JavaScript
- HTML/CSS

## The JSON format we agreed upon
```text
{
  "group_stats": {
    "total_messages_in_chat": int,
    "total_words_in_chat":    int,
    "chat_duration_days":     int,
    "night_owl":              "Name",
    "cncse_msgr":             "Name",
    "chatterbox":             "Name",
    "ghost":                  "Name",
    "conversation_starter":   "Name",
    "selective_responder":    "Name",
    "favourite":              "Name",
    "busiest_day":            "DD/MM/YY",
    "longest_silence":        "Stringified Timedelta object",
    "hype_person":            "Name"
  },
  "emoji_stats": { "<emoji>": count, ... },
  "per_person": {
    "Name": {
      "total_messages":         int,
      "total_words":            int,
      "avg_response_time_mins": "X.Y",
      "activity_heatmap":       { "00": int, ..., "23": int },
      "top3_emojis":            [ "<e1>", "<e2>", "<e3>" ]
    },
    ...
  }
}
```

## How to Run

### Prerequisites
- Python 3.10+
- `numpy`: install with `pip install numpy`
- A modern web browser (Chrome, Firefox, Edge)

### Steps

1. **Generate the chat.** From inside the `generator/` folder:
```
   cd generator
   python3 chat.py vocabulary.txt
   cd ..
```
   Creates `chat.txt` in the project root.

2. **Compute statistics.** From inside the `parser/` folder:
```
   cd parser
   python3 analyze.py chat.txt
   cd ..
```
   Creates `data.json` in the project root.

3. **Serve the slideshow.** From the **project root** (not from `web/`):
```
   python3 -m http.server 5500
```
   Then open `http://127.0.0.1:5500/web/index.html` in your browser.

### Navigation
- Click the **left/right arrow buttons** on screen, or
- Press the **Left/Right arrow keys** to advance through slides.
- On the **User Profiles** slide, click any member's button to add their profile card; click again to remove it. Multiple profiles can be displayed side by side for comparison.
