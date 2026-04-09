import json
import sys
import datetime

f = sys.argv[1]

outfile = open('data.json', 'a')
file = open(f, 'r')

data = {}

#1. Total messages per person and #2. Word count of each person
members = ['Ishan', 'Abhinav', 'P3', 'P4', 'P5', 'P6', 'P7']
no_of_msgs = {}
word_count = {}
for member in members:
    msgs = 0
    words = 0
    for line in file:
        if member in line:
            msgs = msgs + 1
            #partition returns a tuple of length 3 (before, word, after)
            #message is only after the name of the sender
            message = line.partition(f'{member}: ')[2]
            msg_words = message.split()
            words = words + len(msg_words)
    #reset the cursor to the first line
    file.seek(0)
    no_of_msgs[member] = msgs
    word_count[member] = words

data['total_msgs'] = no_of_msgs
data['total_words'] = word_count

#3. The Nightowl
night_senders = []
twelve_am = datetime.time(0,0,0)
four_am  = datetime.time(4,0,0)
for line in file: 
    mtime = datetime.time(int(line[10:12]), int(line[13:15]))
    #if the msgtime is between 12 am and 4 am
    if mtime >= twelve_am and mtime <= four_am:
        line_words = line.split()
        sender = line_words[3][:-1]
        night_senders.append(sender)
file.seek(0)
nightowl = max(set(night_senders), key=night_senders.count) #gives the most frequently occuring sender
data['night_owl'] = nightowl

#4. The CNCSE_MSGR
#The person with the least average word count per message
avg_word_count = {key: word_count[key] / no_of_msgs[key] for key in no_of_msgs}
min_avg_wc = min(avg_word_count.values())
for key in avg_word_count.keys():
    if avg_word_count[key] == min_avg_wc:
        cncse_msgr = key
data['CNCSE_MSGR'] = cncse_msgr

#5. The Ghost
# We are defining the ghost as the person with the most continuous messages, i.e., message streaks (irrespective of time)

#6. The Conversation Starter
#The person who starts the convo after a period of silence (to be decided how long)

#7. The Selective Responder (and their favourite person)
#NEW PERSONALITY: Selective Responder, Responds A LOT to their favourite person

#8. Most used emoji per person

#9. Busiest Day
dates = []
for line in file:
    date = line[:8]
    dates.append(date)
file.seek(0)
busiest_day = max(set(dates), key=dates.count)
data['busiest_day'] = busiest_day

#10. Longest Silence
datetimes = []
maxgap = datetime.timedelta(0)
for line in file:
    date_time = datetime.datetime.strptime(line[:15], "%d/%m/%y, %H:%M")
    datetimes.append(date_time)
file.seek(0)
for i in range(len(datetimes) - 1):
    gap = datetimes[i + 1] - datetimes[i]
    if gap > maxgap:
        maxgap = gap
data['longest_silence'] = str(maxgap)
    

#11. Average response time of each person and 12. Hype person (person with least average response time)
#check that the previous sender is not themselves



#putting everything in the json file
json.dump(data, outfile, indent=4)
outfile.close()
file.close()

