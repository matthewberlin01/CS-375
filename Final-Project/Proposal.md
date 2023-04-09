# CS 375 Final Project: Probability Emulator
#### Created by: Matthew Berlin

#

## Overview
For this project, I will be creating a probability emulator using D3JS. The goal is to display an accurate tally of coin tosses over time to represent the average probability of tossing a coin.

#

## Animation Goals
There are two main graphical components I plan on making for this emulator: a coin being flipped and a chart representing the total number of coin tosses for either heads or tails. For the coin, whenever a button is pressed to simulate a coin being tossed, the coin should move up and down and rotate as if is being flipped. There will be an H and a T on either side of the coin to visually show either heads or tails, respectively. Whenever the coin lands after a test has been performed, the graph should update to show the new total value based on the result of the simulation. The graph should display how many heads and tails have been tossed, as well as have a bar to show the overall ratio of heads to tails. 

#

## Functionality Goals
In combination to the bar chart and coin, there should be a button that can be interacted with. Upon clicking the button, this should begin the coin flip animation. Simultaneously, this should simulate what the outcome of the coin toss should be, either heads or tails. Based on this outcome, the coin should display whatever side was simulated as the result. Once the coin flip animation has completed and shown what side was simulated, the bar chart's value for that side should increment, and the graph should be visually updated to reflect this. The button should not be interactable until all animations and values have been properly updated.
