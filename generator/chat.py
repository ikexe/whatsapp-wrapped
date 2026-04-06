import numpy as np
from numpy import random
from numpy import datetime64
import datetime
import os
import sys

members = ['Ishan', 'Abhinav', 'P3', 'P4', 'P5', 'P6', 'P7'] #members of the gc (who took cs108 this sem :p)

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

#converting numpy date to the required style



vocabulary = sys.argv[1]

f = open('chat.txt', 'a')
#generating the chat
#taking a span of 1 year to start off say 1-1-25 to 1-2-25
with open(vocabulary, 'r') as file:
    words = file.readline().split(sep = ',')
    #each line should be of the form DD/MM/YY, HH:MM - Sender_Name: Message text
    sender_p = prob_array(7) #probability of the message sender
    #the person with the highest probability is automatically the "Chatterbox"
    total = []
    #the date format is different in numpy
    start =  datetime64('2025-01-01')
    end = datetime64('2025-02-01') #exclusive
    dates = np.arange(start, end) #array of all the dates
    #this logic may cause one person to have multiple characterisitics
    chatterbox = members[np.argmax(sender_p)]
    short_msgs = random.choice(members, size = 2) #these people will send short messages
    nightowl = random.choice(members)
    #need to make an array with nightowl having the highest probability
    nightsender = prob_array(7)
    #swapping the max and the nightowl probabilities
    temp = nightsender[np.argmax(nightsender)]
    nightsender[np.argmax(nightsender)] = nightsender[members.index(nightowl)]
    nightsender[members.index(nightowl)] = temp
    twelve_am = datetime.time(0,0,0)
    four_am  = datetime.time(4,0,0)
    ghost = random.choice(members)
    prev_sender = "" #this will help in the "Ghosted"
    print(chatterbox, short_msgs, nightowl, ghost)

    for date in dates:
        no_of_msgs = random.randint(0, 101) #number of messages that day
        for i in range(no_of_msgs + 1):
            time = rand_time()
            mtime = time.strftime('%H:%M') #for removing the seconds
            
            #normal chat
            sender = random.choice(members, p = sender_p)
            if sender in short_msgs:
                no_of_words = random.randint(1, 21) #can't have empty msgs, assuming a short message to be less than or equal to 20 words
            else:
                no_of_words = random.randint(10, 51)
            
            #if the time is between 12am and 4am, the probability of the "Nightowl" sending the message should be higher (this overwrites the above sender)
            if time >= twelve_am and time <= four_am:
                sender = random.choice(members, p = nightsender)

            #if previous sender was the ghost, increase their probability to message again
            # (ISSUE): this may cause the ghost to send more messages than the chatterbox and if ghost is nightowl, it reduces the night activity of the nightowl
            if prev_sender == ghost:
                x = random.randint(0, 4)
                #almost a 1 in 5 chance of the ghost getting ghosted
                if x == 0:
                    sender = ghost
                else:
                    sender = random.choice(members, p = sender_p)
            
            message_arr = random.choice(words, size=no_of_words) #is an array
            message = ' '.join(message_arr)
            #date.astype(datetime.datetime).strftime('%d/%m/%Y')
            #first changing the date type from dt64 to dt and then changing the format (year prints as yy for %y and YYYY for %Y)
            data = f'{date.astype(datetime.datetime).strftime('%d/%m/%y')}, {mtime} - {sender}: {message}\n'
            prev_sender = sender
            total.append(data)

    #after generating, we can sort by datetime
    total.sort(key = lambda x: datetime.datetime.strptime(x[:15], "%d/%m/%y, %H:%M"))

    for line in total:
        f.write(line)

f.close()