"use strict";
var Alexa = require("alexa-sdk");
var chance = require('chance').Chance();
const dashbot = require('dashbot')('NnwomYrdlu6OSoxiWhlmLiJ5a639lXtjcicrMuxn').alexa;

var teams = {
    "0" : {
        "name": "Rajasthan",
        "budget": 150000000,
        "team": []
    },
    "1": {
        "name": "Mumbai",
        "budget": 150000000,
        "team": []
    },
    "2": {
        "name": "Chennai",
        "budget": 150000000,
        "team": []
    },
    "3": {
        "name": "Delhi",
        "budget": 150000000,
        "team": []
    },
    "4": {
        "name": "Punjab",
        "budget": 150000000,
        "team": []
    },
    "5": {
        "name": "Bangalore",
        "budget": 150000000,
        "team": []
    },
    "6": {
        "name": "Hyderabad",
        "budget": 150000000,
        "team": []
    },
    "7": {
        "name": "Kolkata",
        "budget": 150000000,
        "team": []
    },
}

var players = {
    "Batsmen": {
                "Ajinkya Rahane": { 
                    "name": "Ajinkya Rahane",
                    "baseprice": 10000000,
                    "randbidamount": 15,
                    "points": 8.5,
                    "sold": false
                    },
                
                "Steve Smith": {  
                    "name": "Steve Smith",
                    "baseprice": 20000000,
                    "randbidamount": 20,
                    "points": 9.5,
                    "sold": false
                    },
                
                "Yuvraj Singh": { 
                    "name": "Yuvraj Singh", 
                    "baseprice": 10000000,
                    "randbidamount": 15,
                    "points": 8,
                    "sold": false
                    },
                
                "Virat Kohli": {  
                    "name": "Virat Kohli",
                    "baseprice": 20000000,
                    "randbidamount": 20,
                    "points": 10,
                    "sold": false
                    },
                
                "Rohit Sharma": {  
                    "name": "Rohit Sharma",
                    "baseprice": 10000000,
                    "randbidamount": 15,
                    "points": 8.5,
                    "sold": false
                    },
                
                "Chris Gayle": {  
                    "name": "Chris Gayle",
                    "baseprice": 20000000,
                    "randbidamount": 20,
                    "points": 9.5,
                    "sold": false
                    }
                }
}


var handlers = {
    'LaunchRequest': function () {
        if(!this.attributes.userId){
            this.handler.state = "_NEW";
            this.attributes.teamlist = teams;
            this.attributes.playerslist = players;
            this.response.speak("Vuvuzela.mp3 Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
        }
            this.handler.state = "_NEW";
            this.response.speak("Vuvuzela.mp3 Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
    },   
}


var gamehandlers = Alexa.CreateStateHandler("_NEW", {
    'LaunchRequest': function () {
        if(!this.attributes.userId){
            this.handler.state = "_NEW";
            this.attributes.teamlist = teams;
            this.attributes.playerslist = players;
            this.response.speak("Vuvuzela.mp3 Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
        }
            this.handler.state = "_NEW";
            this.response.speak("Vuvuzela.mp3 Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
    },   
    'teamSelectionIntent': function () {
        this.handler.state = "_NEW";
        this.attributes.teamchosen = slotValue(this.event.request.intent.slots.teamchosen);
        this.response.speak(`You chose ${this.attributes.teamchosen}. You will begin with INR 15,00,00,000 in your purse. You will need to form a team of 6 players with at least 3 batsmen, 2 bowlers and 1 wicket keeper. Do you want to hear the rules again or shall we start?`).listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = "_NEW";
        this.emitWithState('startIntent');
    },
    'startIntent': function () {
        this.handler.state = "_BID";
        this.attributes.currentPlayer = playerToBid(this.attributes.playerslist);
        this.response.speak(`All righty! The first set of players going under the hammer will be batsmen. The first batsman going up for auction is ${this.attributes.currentPlayer.name} with an overall of ${this.attributes.currentPlayer.points}. The starting bid is INR ${this.attributes.currentPlayer.baseprice}. Would you like to place a bid?`).listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function () {
        this.response.speak("You will begin with INR 15,00,00,000 in your purse. You will need to form a team of 6 players with atleast 3 batsmen, 2 bowlers and 1 wicket keeper. Do you want to hear the rules again or shall we start?").listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = "_NEW";
        this.response.speak('Cancel');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = "_NEW";
        this.response.speak('Stop');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.handler.state = "_NEW";
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.handler.state = "_NEW";
        const message = 'I don\'t get it! Try saying Alexa, Open crypto flash!';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'UnhandledIntent': function() {
        this.handler.state = "_NEW";
        const message = 'I don\'t get it! Try saying Alexa, Open crypto flash!';
        this.response.speak(message);
        this.emit(':responseReady');
    }

});

var bidHandlers = Alexa.CreateStateHandler("_BID", {
    

    'AMAZON.YesIntent': function () {
    
        let resp = bidder(this.attributes.teamchosen,this.attributes.teamlist,this.attributes.currentPlayer);

        this.response.speak(resp).listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {

        let obj = bidderNo(this.attributes.teamlist,this.attributes.currentPlayer);
        this.attributes.teamlist[obj.lastbidby].budget -= obj.bid;
        this.attributes.teamlist[obj.lastbidby].team.push(obj.name);
        this.response.speak(obj.resp).listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },


    'AMAZON.HelpIntent': function () {
        this.handler.state = "_BID";
        this.response.speak("Alexa will ask you a question, and you have to tell whether it flies or not. You have to respond with a Yes or No. If you are able to answer all of them correctly, you win, else alexa wins. So would you like to play?").listen('Would you like to play?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = "_NEW";
        this.response.speak('I thought we were having a good time. Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.handler.state = "_NEW";
        this.response.speak('I thought we were having a good time. Goodbye!');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.handler.state = "_NEW";
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        this.handler.state = "_NEW";
        const message = 'I don\'t get it! Try saying Alexa, Open does it fly!';
        this.response.speak(message);
        this.emit(':responseReady');
    }
});







































function bidder(myteam, teamlist, player){
    let obj = {};
    let say = `${myteam} open the bid for ${player.name} at ${player.baseprice} INR. `
    let currbid = player.baseprice + 5000000;

    let randomNumber = Math.floor(Math.random() * (8));
    if(randomNumber == 0){
        say += `<break time="1s"/> Any bids of ${currbid} INR for ${player.name} ? <break time="1s"/> Any bids for ${currbid} ? Looks like there are no further bids for ${player.name} . <break time="2s"/> And he is <break time="1s"/> Sold! To ${myteam} for ${player.baseprice} INR!`;
        return say;
    }

    let randomArray = chance.pickset(['0', '1', '2', '3', '4', '5', '6', '7'], randomNumber);
    console.log(randomArray);

    obj = randomBid(randomArray,teamlist, player);
    say += obj.resp;
    return say;

}

function randomBid(randArr,teamlist, player){
    let obj = {
        resp: "",
        lastbidby: "",
        bid: 0
    };
    let totalBid = Math.floor(Math.random() * (player.randbidamount));
    let currbid = player.baseprice + 5000000;
    let randomNumber = Math.floor(Math.random() * (randArr.length));
    let currrand = randomNumber;
    for(let t = 0; t<totalBid; t++){
        obj.resp += `${teamlist[randArr[randomNumber]].name} with a bid of ${currbid}. <break time="0.5s"/>`
        obj.bid = currbid;
        obj.lastbidby = [randArr[randomNumber]];
        currbid += 5000000;
        randomNumber = Math.floor(Math.random() * (randArr.length));
        while(randomNumber == currrand){
            randomNumber = Math.floor(Math.random() * (randArr.length));
        }
        currrand = randomNumber;
    }
    obj.resp += ` Would you like to make a Bid of ${currbid} INR ? `;
    
    return obj;

}

function bidderNo(teamlist, player){
    let obj = {};
    let say = `The opening bid for ${player.name} is ${player.baseprice} INR. Who wants to bid for ${player.name} at ${player.baseprice}. Oh, `
    let currbid = player.baseprice;

    let randomNumber = Math.floor(Math.random() * (8));

    let randomArray = chance.pickset(['0', '1', '2', '3', '4', '5', '6', '7'], randomNumber);
    console.log(randomArray);

    obj = randomBidNo(randomArray,teamlist, player);
    say += obj.resp;
    obj.resp = say;
    return obj;

}

function randomBidNo(randArr,teamlist, player){
    let obj = {
        resp: "",
        name: player.name,
        lastbidby: "",
        bid: 0
    };
    let totalBid = Math.floor(Math.random() * (player.randbidamount));
    let currbid = player.baseprice;
    let randomNumber = Math.floor(Math.random() * (randArr.length));
    let currrand = randomNumber;
    for(let t = 0; t<totalBid; t++){
        obj.resp += `${teamlist[randArr[randomNumber]].name} with a bid of ${currbid}. <break time="0.5s"/>`
        obj.bid = currbid;
        obj.lastbidby = [randArr[randomNumber]];
        currbid += 5000000;
        randomNumber = Math.floor(Math.random() * (randArr.length));
        while(randomNumber == currrand){
            randomNumber = Math.floor(Math.random() * (randArr.length));
        }
        currrand = randomNumber;
    }
    obj.resp += `<break time="1s"/> Any bids of ${currbid} INR for ${player.name} ? <break time="1s"/> Any bids for ${currbid} ? Looks like there are no further bids for ${player.name} . <break time="2s"/> And he is <break time="1s"/> Sold! To ${teamlist[obj.lastbidby].name} for ${obj.bid} INR!`;
    
    return obj;

}









function playerToBid(playerlist){
    let curr = {};
    let set = false;
    for (let [key, value] of Object.entries(playerlist)) {  
        if(Object.keys(key).length!=0){
            for (let [keyin, valuein] of Object.entries(value)) { 
                curr = valuein;
                delete value.keyin;
                set = true;
                break;
            }
        }
        if(set == true){
            break;
        }
    }
    return curr;
}




























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





































if (!Object.entries)
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
};

if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;
  
      return function(obj) {
        if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
  
        var result = [], prop, i;
  
        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
  
        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }());
  }
  

// This is the function that AWS Lambda calls every time Alexa uses your skill.
exports.handler = dashbot.handler(function(event, context, callback) {

// Set up the Alexa object
var alexa = Alexa.handler(event, context); 

alexa.dynamoDBTableName = 'CricketAuction';

// Register Handlers
alexa.registerHandlers(handlers, bidHandlers, gamehandlers); 

// Start our Alexa code
alexa.execute(); 
  
});
