"use strict";
var Alexa = require("alexa-sdk");
const dashbot = require('dashbot')('NnwomYrdlu6OSoxiWhlmLiJ5a639lXtjcicrMuxn').alexa;

var teams = {
    "Rajasthan" : 150000000,
    "Mumbai": 150000000,
    "Chennai": 150000000,
    "Delhi": 150000000,
    "Punjab": 150000000,
    "Bangalore": 150000000,
    "Hyderabad": 150000000,
    "Kolkata": 150000000
}

var players = {
    "Batsmen": [
                    {"Ajinkya Rahane": {  
                        "baseprice": 10000000,
                        "randbidamount": 15,
                        "points": 8.5
                        }
                    },
                    {"Steve Smith": {  
                        "baseprice": 20000000,
                        "randbidamount": 20,
                        "points": 9.5
                        }
                    },
                    {"Yuvraj Singh": {  
                        "baseprice": 10000000,
                        "randbidamount": 15,
                        "points": 8
                        }
                    },
                    {"Virat Kohli": {  
                        "baseprice": 20000000,
                        "randbidamount": 20,
                        "points": 10
                        }
                    },
                    {"Rohit Sharma": {  
                        "baseprice": 10000000,
                        "randbidamount": 15,
                        "points": 8.5
                        }
                    },
                    {"Chris Gayle": {  
                        "baseprice": 20000000,
                        "randbidamount": 20,
                        "points": 9.5
                        }
                    },


               ]
}





var handlers = {
    'LaunchRequest': function () {
        if(!this.attributes.userId){

            this.attributes.teams = teams;
            this.attributes.players = players;
            this.response.speak("Vuvuzela.mp3 Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
        }
        this.response.speak("Vuvuzela.mp3 Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
        this.emit(':responseReady');
    },   
    'teamSelectionIntent': function () {
        this.attributes.teamchosen = slotValue(this.event.request.intent.slots.teamchosen);
        this.response.speak(`You chose ${this.attributes.teamchosen}. You will begin with INR 15,00,00,000 in your purse. You will need to form a team of 6 players with atleast 3 batsmen, 2 bowlers and 1 wicket keeper. Do you want to hear the rules again or shall we start?`).listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'startIntent': function () {
        this.response.speak("You will begin with INR 15,00,00,000 in your purse. You will need to form a team of 6 players with atleast 3 batsmen, 2 bowlers and 1 wicket keeper. Do you want to hear the rules again or shall we start?").listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak("You will begin with INR 15,00,00,000 in your purse. You will need to form a team of 6 players with atleast 3 batsmen, 2 bowlers and 1 wicket keeper. Do you want to hear the rules again or shall we start?").listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Cancel');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Stop');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        const message = 'I don\'t get it! Try saying Alexa, Open crypto flash!';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'UnhandledIntent': function() {
        const message = 'I don\'t get it! Try saying Alexa, Open crypto flash!';
        this.response.speak(message);
        this.emit(':responseReady');
    }

};




function slotValue(slot, useId){
    if(slot.value == undefined){
        return "undefined";
    }
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}

// This is the function that AWS Lambda calls every time Alexa uses your skill.
exports.handler = dashbot.handler(function(event, context, callback) {

// Set up the Alexa object
var alexa = Alexa.handler(event, context); 

alexa.dynamoDBTableName = 'CricketAuction';

// Register Handlers
alexa.registerHandlers(handlers); 

// Start our Alexa code
alexa.execute(); 
  
});
