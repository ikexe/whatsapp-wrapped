# Whatsapp Wrapped
CS108 project for Spring 2026.

This project involves building a browser-based, Spotify Wrapped-style slideshow that visualises 
social dynamics found in a WhatsApp group chat. The system has three parts: a Python chat 
generator, a Python statistics parser, and a JavaScript front-end. Python and JavaScript 
communicate solely through a JSON file that you design.

## Team Members:
- Abhinav Verma -25B1027
- Ishan Kumar -25B1074

## System Pipeline
```
vocabulary.txt → chat.py → chat.txt → analyze.py → data.json → app.js → Browser
```
## Directory Structure
```
whatsapp-wrapped/ 
├── generator/chat.py 
├── parser/analyze.py 
├── web/  (index.html, style.css, app.js) 
├── chat.txt 
├── data.json 
└── vocabulary.txt
```
## Tech Tools
- Python
- JavaScript
- HTML/CSS

## The JSON format we agreed upon
{\
  "group_stats": {\
    "total_messages_in_chat": int,\
   "total_words_in_chat":    int,\
   "chat_duration_days":     int,\
    "night_owl":              "Name",\
    "cncse_msgr":             "Name",\
    "chatterbox":             "Name",\
    "ghost":                  "Name",\
    "conversation_starter":   "Name",\
    "selective_responder":    "Name",\
    "favourite":              "Name",\
    "busiest_day":            "DD/MM/YY",\
    "longest_silence":        "Stringified Timedelta object",\
    "hype_person":            "Name"\
  },\
  "emoji_stats": { "<emoji>": count, ... },\
  "per_person": {\
    "Name": {\
      "total_messages":         int,\
      "total_words":            int,\
      "avg_response_time_mins": "X.Y",\
      "activity_heatmap":       { "00": int, ..., "23": int },\
      "top3_emojis":            [ "<e1>", "<e2>", "<e3>" ]\
    },\
    ...\
  }\
}\
