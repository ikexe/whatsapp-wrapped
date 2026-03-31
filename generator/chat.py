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
    #the date format is different in numpy
    start =  datetime64('2025-01-01')
    end = datetime64('2025-02-01') #exclusive
    dates = np.arange(start, end) #array of all the dates
    for date in dates:
        no_of_msgs = random.randint(0, 10) #number of messages that day
        for i in range(no_of_msgs + 1):
            sender = random.choice(members, p = sender_p)
            time = rand_time().strftime('%H:%M') #for removing the seconds
            no_of_words = random.randint(1, 101) #can't have empty msgs
            message_arr = random.choice(words, size=no_of_words) #is an array
            message = ' '.join(message_arr)
            #date.astype(datetime.datetime).strftime('%d/%m/%Y')
            #first changing the date type from dt64 to dt and then changing the format (year prints as yy for %y and YYYY for %Y)
            data = f'{date.astype(datetime.datetime).strftime('%d/%m/%y')}, {time} - {sender}: {message}\n'
            f.write(data)

    #after generating, we can sort by time

f.close()