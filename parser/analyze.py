import json
import sys
import datetime
import re
from pathlib import Path

root_dir = Path.cwd().parent
try:
    input = next(root_dir.rglob(sys.argv[1]))
except StopIteration:
    print("chat.txt not found:(")

try:
    output = next(root_dir.rglob("data.json"))
except StopIteration:
    print("data.json not found:(")
    
try:
    vocabulary = next(root_dir.rglob("vocabulary.txt"))
except StopIteration:
    print("vocabulary.txt not found:(")
    
text_file = open(vocabulary, 'r')
text = text_file.readlines()[0]
text_file.close()
emoji_pattern = re.compile(
    "[^"
    "\U0001F600-\U0001F64F"  
    "\U0001F300-\U0001F5FF"  
    "\U0001F680-\U0001F6FF"  
    "\U0001F1E6-\U0001F1FF"  
    "\U00002700-\U000027BF"  
    "\U0001F900-\U0001F9FF"  
    "\U0001FA70-\U0001FAFF"  
    "\U00002600-\U000026FF"  
    "\U00002B00-\U00002BFF"
    "]+",
    flags=re.UNICODE
)
cleaned = re.sub(emoji_pattern,",", text)
emojis = cleaned.split(",")
emojis = list(filter(None, emojis))


f = input

outfile = open(output, 'w')
file = open(f, 'r')
lines = file.readlines()
data = {}
group_stats = {}
emoji_stats = {}
per_person = {}
no_of_msgs = {}
no_of_words = {}
# Total messages and total word count
members = ['Ishan', 'Abhinav', 'Lokesh', 'Mohan', 'Rishanth', 'Bhanu', 'Rutvik']
tot_msgs = 0
word_count = 0

for line in lines:
    tot_msgs += 1
    msg = line.split()[4:]
    word_count += len(msg)
    

group_stats['total_messages_in_chat'] = tot_msgs
group_stats['total_words_in_chat'] = word_count

# Chat duration
first_day = datetime.datetime.strptime(lines[0][:8], "%d/%m/%y")
last_day =  datetime.datetime.strptime(lines[-1][:8], "%d/%m/%y")
chat_duration_days = (last_day - first_day).days + 1
group_stats["chat_duration_days"] = chat_duration_days

# The Nightowl
night_senders = []
twelve_am = datetime.time(0,0,0)
four_am  = datetime.time(4,0,0)
for line in lines: 
    mtime = datetime.time(int(line[10:12]), int(line[13:15]))
    #if the msgtime is between 12 am and 4 am
    if mtime >= twelve_am and mtime <= four_am:
        line_words = line.split()
        sender = line_words[3][:-1]
        night_senders.append(sender)

nightowl = max(set(night_senders), key=night_senders.count) #gives the most frequently occuring sender
group_stats['night_owl'] = nightowl

# The CNCSE_MSGR and The Chatterbox
#The person with the least average word count per message
for member in members:
    msgs = 0
    words = 0
    for line in lines:
        if member in line:
            msgs = msgs + 1
            #partition returns a tuple of length 3 (before, word, after)
            #message is only after the name of the sender
            message = line.partition(f'{member}: ')[2]
            msg_words = message.split()
            words = words + len(msg_words)
        
    no_of_msgs[member] = msgs
    no_of_words[member] = words
    
avg_word_count = {key: no_of_words[key] / no_of_msgs[key] for key in no_of_msgs}
min_avg_wc = min(avg_word_count.values())
for key in avg_word_count.keys():
    if avg_word_count[key] == min_avg_wc:
        cncse_msgr = key

max_msgs = max(no_of_msgs.values())
for key in no_of_msgs.keys():
    if no_of_msgs[key] == max_msgs:
        chatterbox = key
group_stats['cncse_msgr'] = cncse_msgr
group_stats['chatterbox'] = chatterbox

# The Ghost
# We are defining the ghost as the person with the most continuous messages, i.e., message streaks (irrespective of time)
streaks = {}
for member in members:
    streaks[member] = 0

streak = False
prev = ""
for line in lines:
    sender = line.split()[3][:-1]
    if sender == prev :
        if not streak:
            streaks[sender] += 1
            streak = True
    else:
        streak = False
    prev = sender

#Making Ghost as the highest ratio of streak from sent messages
streak_ratio = {}
for member in members:
    streak_ratio[member] = streaks[member] / no_of_msgs[member]

max_ghosted = max(streak_ratio.values())
for key in streak_ratio.keys():
    if streak_ratio[key] == max_ghosted:
        ghost = key
group_stats['ghost'] = ghost

# The Conversation Starter
#The person who starts the convo after a period of silence (assuming 1hr to be a long silence)
convo_starters = []
datetimes = []
silence = datetime.timedelta(hours = 1)
for line in lines:
    date_time = datetime.datetime.strptime(line[:15], "%d/%m/%y, %H:%M")
    datetimes.append(date_time)

for i in range(len(datetimes) - 1):
    gap = datetimes[i + 1] - datetimes[i]
    if gap > silence:
        sender = lines[i + 1].split()[3][:-1]
        convo_starters.append(sender)

conv_st = max(set(convo_starters), key = convo_starters.count)
group_stats["conversation_starter"] = conv_st

# The Selective Responder (and their favourite person)
#NEW PERSONALITY: Selective Responder, Responds A LOT to their favourite person

prev_msgr = {}
bias = {}
for member in members:
    prev_msgr[member] = []

prev_sender = lines[0].split()[3][:-1]
for i in range(1, len(lines)):
    sender = lines[i].split()[3][:-1]
    if prev_sender != sender:
        prev_msgr[sender].append(prev_sender)
    prev_sender = sender

for member in members:
    highest = max(set(prev_msgr[member]), key = prev_msgr[member].count)
    bias[member] = prev_msgr[member].count(highest) / len(prev_msgr[member])

max_bias = max(bias.values())
for key in bias.keys():
    if bias[key] == max_bias:
        sel_res = key
        fav = max(set(prev_msgr[key]), key = prev_msgr[key].count)

group_stats['selective_responder'] = sel_res
group_stats['favourite'] = fav


# Most used emojis (group)

for emoji in emojis:
    emoji_stats[emoji] = 0
for line in lines:
    for emoji in emojis:
        emoji_stats[emoji] += line.count(emoji)


# Most used emojis (per person)
top3 = {}
top3_emojis = []
emoji_count = {}
for member in members:
    top3[member] = {}
    emoji_count[member] = {}
    for emoji in emojis:
        emoji_count[member][emoji] = 0
        

for line in lines:
    sender = line.split()[3][:-1]
    for emoji in emojis:
        emoji_count[sender][emoji] += line.count(emoji)

for member in members:
    emoji_count[member] = dict(sorted(emoji_count[member].items(), key = lambda x : x[1], reverse=True))
    top3[member] = {k: emoji_count[member][k] for i, k in enumerate(emoji_count[member]) if i < 3}


# Busiest Day
dates = []
for line in lines:
    date = line[:8]
    dates.append(date)

busiest_day = max(set(dates), key=dates.count)
group_stats['busiest_day'] = busiest_day

# Longest Silence
datetimes = []
maxgap = datetime.timedelta(0)
for line in lines:
    date_time = datetime.datetime.strptime(line[:15], "%d/%m/%y, %H:%M")
    datetimes.append(date_time)

for i in range(len(datetimes) - 1):
    gap = datetimes[i + 1] - datetimes[i]
    if gap > maxgap:
        maxgap = gap
group_stats['longest_silence'] = str(maxgap)
    

# Average response time of each person and # Hype person (person with least average response time)
#check that the previous sender is not themselves
avg_rtime = {}
rtime = {}
for member in members:
    rtime[member] = []
    avg_rtime[member] = datetime.timedelta(0)

prev_sender = lines[0].split()[3][:-1]
prev_mtime = datetime.datetime.strptime(lines[0][:15], "%d/%m/%y, %H:%M")
for i in range(1, len(lines)):
    sender = lines[i].split()[3][:-1]
    mtime = datetime.datetime.strptime(lines[i][:15], "%d/%m/%y, %H:%M")
    if prev_sender != sender:
        rtime[sender].append(mtime - prev_mtime)
    prev_sender = sender
    prev_mtime = mtime
    
for key in rtime.keys():
    # need to provide the starting value in sum so that there is no type error
    sorted_times = sorted(rtime[key])
    n = len(sorted_times)
    if n%2 == 1:
        avg_rtime[key] = sorted_times[n//2]
    else:
        avg_rtime[key] = (sorted_times[n//2 - 1] + sorted_times[n//2])/2

min_rtime = min(avg_rtime.values())
for key in avg_rtime.keys():
    if avg_rtime[key] == min_rtime:
        hype_person = key

group_stats["hype_person"] = hype_person

#Activity Heatmap - Number of messages at each hour of the day
activity_heatmap = {}
for member in members:
    activity_heatmap[member] = {}
    for i in range(0, 24):
        if i < 10:
            key = f'0{i}'
        else:
            key = str(i)
        activity_heatmap[member][key] = 0

for line in lines:
    sender = line.split()[3][:-1]
    msg_hr = line[10:12]
    activity_heatmap[sender][msg_hr] += 1

#Per_person stats
for member in members:
    member_data = {}
    member_data["total_messages"] = no_of_msgs[member]
    member_data["total_words"] = no_of_words[member]
    member_data["avg_response_time_mins"] = f'{avg_rtime[member].total_seconds() / 60:.1f}'
    member_data["activity_heatmap"] = activity_heatmap[member]
    member_data["top3_emojis"] = list(top3[member].keys())
    per_person[member] = member_data

#putting everything in the json file
data["group_stats"] = group_stats
data["emoji_stats"] = emoji_stats
data["per_person"] = per_person
json.dump(data, outfile, indent=4, ensure_ascii=False)
outfile.close()
file.close()
#print(f"chatterbox {chatterbox}, short_msg {cncse_msgr}, nightowl {nightowl}, ghost {ghost}, sel_res {sel_res}, fav {fav}") #comment while submitting

