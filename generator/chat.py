import numpy as np
from numpy import random
from numpy import datetime64
import datetime
import os
import sys

members = ['Ishan', 'Abhinav', 'Lokesh', 'Mohan', 'Rishanth', 'Bhanu', 'Rutvik'] #members of the gc (who took cs108 this sem :p)

#making an array of probablities
def prob_array(n):
    arr = random.rand(n)
    sum = arr.sum()
    probability = arr / sum
    return probability

#picking a random time
def rand_time():
    hour = random.randint(0,24)
    minutes = random.randint(0,60)
    return  datetime.time(hour, minutes)

vocabulary = sys.argv[1]

f = open('chat.txt', 'a')
#generating the chat
#taking a span of 1 year to start off say 1-1-25 to 1-2-25
with open(vocabulary, 'r') as file:
    words = file.readline().split(sep = ',')
    #each line should be of the form DD/MM/YY, HH:MM - Sender_Name: Message text
    sender_p = prob_array(7) #probability of the message sender
    sender_p[np.argmax(sender_p)] += 0.25
    sender_p /= sender_p.sum() #to explicitly increase the chatterbox probability (it was getting lower than ghost and nightowl)
    #the person with the highest probability is automatically the "Chatterbox"
    total = []
    #the date format is different in numpy
    start =  datetime64('2025-01-01')
    end = datetime64('2026-01-01') #exclusive
    dates = np.arange(start, end) #array of all the dates
    #this logic may cause one person to have multiple characterisitics
    chatterbox = members[np.argmax(sender_p)]
    short_msg = random.choice(members) #these people will send short messages
    nightowl = random.choice(members)
    ghost = random.choice(members)
    #need to make an array with nightowl having the highest probability
    nightsender = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
    nightsender[members.index(nightowl)] = 0.4
    nightsender[members.index(chatterbox)] = 0.1
    nightsender[members.index(ghost)] = 0.1
    twelve_am = datetime.time(0,0,0)
    four_am  = datetime.time(4,0,0)
    
    #NEW PERSONALITY: Selective Responder, Responds A LOT to their favourite person
    sel_res = random.choice([i for i in members if i != ghost and i != chatterbox])
    fav = random.choice([i for i in members if i != sel_res and i != ghost])
    sender_p[members.index(sel_res)] /= 3 #to explicitly decrease the probability of sel_res normally sending a message
    sender_p /= sender_p.sum()
    prev_sender = "" #this will help in the "Ghosted and Selective Responder"
    print(f"chatterbox {chatterbox}, short_msg {short_msg}, nightowl {nightowl}, ghost {ghost}, sel_res {sel_res}, fav {fav}") #comment while submitting

    for date in dates:
        no_of_msgs = random.randint(0, 101) #number of messages that day
        for i in range(no_of_msgs + 1):
            time = rand_time()
            mtime = time.strftime('%H:%M') #for removing the seconds
            
            #date.astype(datetime.datetime).strftime('%d/%m/%Y')
            #first changing the date type from dt64 to dt and then changing the format (year prints as yy for %y and YYYY for %Y)
            data = f'{date.astype(datetime.datetime).strftime('%d/%m/%y')}, {mtime}'
            
            total.append(data)

    #after generating, we can sort by datetime
    total.sort(key = lambda x: datetime.datetime.strptime(x[:15], "%d/%m/%y, %H:%M"))

    for i in range(len(total)):    
        #normal chat
        sender = random.choice(members, p = sender_p)
        time = datetime.time(int(total[i][10:12]), int(total[i][13:15]))
        
        #if the time is between 12am and 4am, the probability of the "Nightowl" sending the message should be higher (this overwrites the above sender)
        if time >= twelve_am and time <= four_am:
            sender = random.choice(members, p = nightsender)

        #if previous sender was the ghost, increase their probability to message again
        if prev_sender == ghost:
            x = random.randint(0, 2)
            #almost a 1 in 3 chance of the ghost getting ghosted
            if x == 0:
                sender = ghost
            else:
                if time >= twelve_am and time <= four_am:
                    sender = random.choice(members, p = nightsender)
                else:
                    sender = random.choice(members, p = sender_p)

        #if the previous sender was the fav person of sel_res
        if prev_sender == fav:
            x = random.randint(0, 3)
            #almost a 1 in 4 chance of the sel_res responding
            if x == 0:
                sender = sel_res
            else:
                if time >= twelve_am and time <= four_am:
                    sender = random.choice(members, p = nightsender)
                else:
                    sender = random.choice(members, p = sender_p)

        #moved this check to the end as the sender keeps changing
        if sender == short_msg:
            no_of_words = random.randint(1, 21) #can't have empty msgs, assuming a short message to be less than or equal to 20 words
        else:
            no_of_words = random.randint(10, 51)
        
        message_arr = random.choice(words, size=no_of_words) #is an array
        message = ' '.join(message_arr)
        total[i] = f'{total[i]} - {sender}: {message}\n'
        prev_sender = sender

    for line in total:
        f.write(line)

f.close()