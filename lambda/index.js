"use strict";


var Alexa = require("alexa-sdk");
var chance = require('chance').Chance();
const dashbot = require('dashbot')('NnwomYrdlu6OSoxiWhlmLiJ5a639lXtjcicrMuxn').alexa;
var data = require('./data');
var players = data.players;
var teams = data.teams;



var handlers = {
    'LaunchRequest': function () {
        if(!this.attributes.userId){
            this.handler.state = "_NEW";
            this.attributes.teamlist = teams;
            this.attributes.playerslist = players;
            this.response.speak("Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
        }

            this.attributes.teamlist = teams;
            this.attributes.playerslist = players;
            this.handler.state = "_NEW";
            this.response.speak("Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
    },   
}


var gamehandlers = Alexa.CreateStateHandler("_NEW", {
    'LaunchRequest': function () {
        if(!this.attributes.userId){
            this.handler.state = "_NEW";
            this.attributes.teamlist = teams;
            this.attributes.playerslist = players;
            this.response.speak("Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
        }
            this.handler.state = "_NEW";
            this.response.speak("Welcome to IPL Auction. Choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emit(':responseReady');
    },   
    'teamSelectionIntent': function () {
        this.handler.state = "_NEW";
        this.attributes.teamchosen = slotValue(this.event.request.intent.slots.teamchosen);

        if(this.attributes.teamchosen == "incorrect"){
            this.response.speak("Please choose a team from Rajasthan, Mumbai, Chennai, Delhi, Punjab, Bangalore, Hyderabad and Kolkata to continue.").listen('You have to choose a team to continue.');
            this.emitWithState(':responseReady');
        }
        else{
            for (let [key, value] of Object.entries(this.attributes.teamlist)){
                if(value.name == this.attributes.teamchosen){
                    this.attributes.teamcode = key;
                }
            }
            this.response.speak(`You chose ${this.attributes.teamchosen}. You will begin with INR 15,00,00,000 in your purse. You will need to form a team of 6 players with at least 3 batsmen, 2 bowlers and 1 wicket keeper. Do you want to hear the rules again or shall we start?`).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = "_NEW";
        this.emitWithState('startIntent');
    },
    'startIntent': function () {
        this.handler.state = "_BID";
        this.attributes.currentPool = "Batsman";
        let result = playerToBid(this.attributes.playerslist, this.attributes.currentPool);
        this.attributes.currentPlayer = result[0];
        this.attributes.playerlist = result[1];
        this.attributes.currentPool = result[2];
        this.response.speak(`All righty! The first set of players going under the hammer will be batsmen. The first ${this.attributes.currentPool} going up for auction is ${this.attributes.currentPlayer.name} with an overall of ${this.attributes.currentPlayer.points}. The starting bid is INR ${this.attributes.currentPlayer.baseprice}. Would you like to place a bid?`).listen('You can ask for any other crypto\'s price.');
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
    
        this.attributes.objBid = bidder(this.attributes.teamchosen,this.attributes.teamcode,this.attributes.teamlist,this.attributes.currentPlayer, this.attributes.currentPool);
        this.handler.state = "_BIDAGAIN";
        this.response.speak(this.attributes.objBid.resp).listen('You can ask for any other crypto\'s price.');
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {

        let obj = bidderNo(this.attributes.teamlist,this.attributes.currentPlayer, this.attributes.currentPool, this.attributes.teamcode);
        this.attributes.teamlist[obj.lastbidby].budget -= obj.bid;
        this.attributes.teamlist[obj.lastbidby].team.push([obj.name, obj.points]);

        let result = playerToBid(this.attributes.playerslist, this.attributes.currentPool);
        this.attributes.currentPlayer = result[0];
        this.attributes.playerlist = result[1];
        this.attributes.currentPool = result[2];

        if(this.attributes.currentPlayer == "complete"){
            this.handler.state = "_COMPLETE";
            obj.resp += `Bazinga! Looks like all the players up for auction today are sold! 88 players went under the hammer today! <break time="1s"/> All the teams are looking formidable now. Let's find out which team will come out the eventual winner on the basis of cumulative points. So are you ready to find out the eventual winner?`
            this.response.speak(obj.resp).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        else{
            obj.resp += ` The next ${this.attributes.currentPool} going up for auction is ${this.attributes.currentPlayer.name} with an overall of ${this.attributes.currentPlayer.points}. The starting bid is INR ${this.attributes.currentPlayer.baseprice}. Would you like to place a bid?`
            this.response.speak(obj.resp).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        
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



var bidAgainHandlers = Alexa.CreateStateHandler("_BIDAGAIN", {
    'AMAZON.YesIntent': function () {
        this.attributes.objBid.bid += 5000000;
        let currbid = this.attributes.objBid.bid + 5000000;

        let resp = `<break time="1s"/> Any bids of ${currbid} INR for ${this.attributes.objBid.name} ? <break time="1s"/> Any bids for ${currbid} ? Looks like there are no further bids for ${this.attributes.objBid.name} . <break time="2s"/> And he is <break time="1s"/> Sold! To ${this.attributes.teamchosen} for ${this.attributes.objBid.bid} INR!`;

        this.attributes.teamlist[this.attributes.teamcode].budget -= this.attributes.objBid.bid;
        this.attributes.teamlist[this.attributes.teamcode].team.push([this.attributes.objBid.name, this.attributes.objBid.points]);

        this.handler.state = "_BID";
        let result = playerToBid(this.attributes.playerslist,this.attributes.currentPool);
        this.attributes.currentPlayer = result[0];
        this.attributes.playerlist = result[1];
        this.attributes.currentPool = result[2];

        if(this.attributes.currentPlayer == "complete"){
            this.handler.state = "_COMPLETE";
            resp += `Bazinga! Looks like all the players up for auction today are sold! 88 players went under the hammer today! <break time="1s"/> All the teams are looking formidable now. Let's find out which team will come out the eventual winner on the basis of cumulative points. So are you ready to find out the eventual winner?`
            this.response.speak(resp).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        else{
            resp += ` The next ${this.attributes.currentPool} going up for auction is ${this.attributes.currentPlayer.name} with an overall of ${this.attributes.currentPlayer.points}. The starting bid is INR ${this.attributes.currentPlayer.baseprice}. Would you like to place a bid?`
            this.response.speak(resp).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        
    },
    'AMAZON.NoIntent': function () {

        let currbid = this.attributes.objBid.bid + 5000000;

        let resp = `<break time="1s"/> Any bids of ${currbid} INR for ${this.attributes.objBid.name} ? <break time="1s"/> Any bids for ${currbid} ? Looks like there are no further bids for ${this.attributes.objBid.name} . <break time="2s"/> And he is <break time="1s"/> Sold! To ${this.attributes.teamlist[this.attributes.objBid.lastbidby].name} for ${this.attributes.objBid.bid} INR!`;

        this.attributes.teamlist[this.attributes.objBid.lastbidby].budget -= this.attributes.objBid.bid;
        this.attributes.teamlist[this.attributes.objBid.lastbidby].team.push([this.attributes.objBid.name, this.attributes.objBid.points]);

        this.handler.state = "_BID";
        let result = playerToBid(this.attributes.playerslist, this.attributes.currentPool);
        this.attributes.currentPlayer = result[0];
        this.attributes.playerlist = result[1];
        this.attributes.currentPool = result[2];
        if(this.attributes.currentPlayer == "complete"){
            this.handler.state = "_COMPLETE";
            resp += `Bazinga! Looks like all the players up for auction today are sold! 88 players went under the hammer today! <break time="1s"/> All the teams are looking formidable now. Let's find out which team will come out the eventual winner on the basis of cumulative points. So are you ready to find out the eventual winner?`
            this.response.speak(resp).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        else{
            resp += ` The next ${this.attributes.currentPool} going up for auction is ${this.attributes.currentPlayer.name} with an overall of ${this.attributes.currentPlayer.points}. The starting bid is INR ${this.attributes.currentPlayer.baseprice}. Would you like to place a bid?`

            this.response.speak(resp).listen('You can ask for any other crypto\'s price.');
            this.emit(':responseReady');
        }
        
    },

    'AMAZON.HelpIntent': function () {
        this.handler.state = "_BIDAGAIN";
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


var completeHandlers = Alexa.CreateStateHandler("_COMPLETE", {
    'resultIntent': function () {
        let winner = {};
        let resp = "The cumulative points scored by players of team ";
        for (let [key, value] of Object.entries(this.attributes.teamlist)) { 
            value.totalpoints = pointCalc(value.team);

            resp += `${value.name} is ${value.totalpoints} points. <break time="1s"/> `;
            if(key==0){
                winner.name = value.name;
                winner.totalpoints = value.totalpoints;
            }
            if(value.totalpoints>winner.totalpoints){
                winner.name = value.name;
                winner.totalpoints = value.totalpoints;
            }
        }
        resp += `Finally the winner of Cricket Auction - IPL Edition is team ${winner.name} with ${winner.totalpoints}!`;
        if(winner.name == this.attributes.teamchosen){
            resp += `Congratulations on winning the Auction! You're sure on your way of becoming a top manager!`;
        }
        else{
            resp +=`Though you came short this time, you played like a true champ. Better luck next time!`
        }
        this.response.speak(resp);
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {
        console.log("in complete handler");
        this.emitWithState('resultIntent');
        
    },
    'AMAZON.NoIntent': function () {
        console.log("in complete handler");
        this.emitWithState('resultIntent');
    },


    'AMAZON.HelpIntent': function () {
        this.handler.state = "_NEW";
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








function pointCalc(team){
    let points = 0;
    for(let z = 0; z <team.length; z++){
        points += team[z][1];
    }
    return points;
}























function bidder(myteam, myteamcode, teamlist, player, currentpool){
    let obj = {};
    let say = `${myteam} open the bid for ${player.name} at ${player.baseprice} INR. `
    let currbid = player.baseprice + 5000000;

    let randomNumber = Math.floor(Math.random() * (8));
   
    while(randomNumber == 0){
        randomNumber = Math.floor(Math.random() * (8));
    }

    if(randomNumber == 0){
        say += `<break time="1s"/> Any bids of ${currbid} INR for ${player.name} ? <break time="1s"/> Any bids for ${currbid} ? Looks like there are no further bids for ${player.name} . <break time="2s"/> And he is <break time="1s"/> Sold! To ${myteam} for ${player.baseprice} INR!`;
        obj.resp = say;
        obj.bid = player.baseprice;
        obj.points = player.points;
        obj.name = player.name;
        obj.lastbidby = myteamcode;
        return obj;
    }

    let randomArray = chance.pickset(teampickerNo(currentpool, teamlist, myteamcode), randomNumber);

    if(randomArray.length == 1){
        currbid += 5000000;
        say += `${teamlist[randomArray[0]].name} with a bid of ${currbid-5000000} INR. <break time="1s"/>  Would you like to make a Bid of ${currbid} INR ? `;
        obj.resp = say;
        obj.bid = currbid-5000000;
        obj.points = player.points;
        obj.name = player.name;
        obj.lastbidby = randomArray[0];
        return obj;
    }

    obj = randomBid(randomArray,teamlist, player);
    say += obj.resp;
    obj.resp = say;
    return obj;

}

function randomBid(randArr,teamlist, player){
    let obj = {
        resp: "",
        points: player.points,
        name: player.name,
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

function bidderNo(teamlist, player, currentpool, myteamcode){
    let obj = {};
    let say = `The opening bid for ${player.name} is ${player.baseprice} INR. Who wants to bid for ${player.name} at ${player.baseprice}. Oh, `
    let currbid = player.baseprice;

    let randomNumber = Math.floor(Math.random() * (8));
    while(randomNumber == 0){
        randomNumber = Math.floor(Math.random() * (8));
    }
    let randomArray = chance.pickset(teampickerNo(currentpool, teamlist, myteamcode), randomNumber);
    if(randomArray.length == 1){
        currbid += 5000000;
        say += `${teamlist[randomArray[0]].name} with a bid of ${player.baseprice} INR. <break time="1s"/> Any bids of ${currbid} INR for ${player.name} ? <break time="1s"/> Any bids for ${currbid} ? Looks like there are no further bids for ${player.name} . <break time="2s"/> And he is <break time="1s"/> Sold! To ${teamlist[randomArray[0]].name} for ${player.baseprice} INR!`
        obj.resp = say;
        obj.bid = player.baseprice;
        obj.points = player.points;
        obj.name = player.name;
        obj.lastbidby = randomArray[0];
        return obj;
    }
    obj = randomBidNo(randomArray,teamlist, player);
    say += obj.resp;
    obj.resp = say;
    return obj;

}

function randomBidNo(randArr,teamlist, player){
    let obj = {
        resp: "",
        points: player.points,
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









function playerToBid(playerlist, currentPool){
    let curr = {};
    let set = false;
    if(Object.keys(playerlist["Batsman"]).length==0){
        console.log("in change to bowler");
        currentPool = "Bowler";
    }
    if(Object.keys(playerlist["Batsman"]).length==0 && Object.keys(playerlist["Bowler"]).length==0){
        currentPool = "WicketKeeper";
    }
    if(Object.keys(playerlist["Batsman"]).length==0 && Object.keys(playerlist["Bowler"]).length==0 && Object.keys(playerlist["WicketKeeper"]).length==0){
        return ["complete", playerlist, currentPool];
    }
    console.log("1st+ ", playerlist);
    if(Object.keys(playerlist[currentPool]).length!=0){
        for (let [key, value] of Object.entries(playerlist[currentPool])) {  
            curr = value;

            console.log("2nd+ ", playerlist);
            delete playerlist[currentPool][key];
            console.log(playerlist[currentPool]);
            set = true;
            console.log(set);
            if(set == true){
                console.log("in set == true");
                break;
            }
            console.log("didn't break");
        }
    }

    console.log("3rd+ ", playerlist);
    console.log(currentPool);
    console.log(playerlist[currentPool]);
    
    if(Object.keys(playerlist["Batsman"]).length==0 && Object.keys(playerlist["Bowler"]).length==0 && Object.keys(playerlist["WicketKeeper"]).length==0){
        return ["complete", playerlist, currentPool];
    }
    console.log(curr, playerlist, currentPool);
    return [curr, playerlist, currentPool];
}



function teampicker(currentpool, teamlist){
    let arr = [];
    for (let [key, value] of Object.entries(teamlist)) {
        if(value[currentpool] > 0){
            arr.push(key);
        }
    }
    console.log("in team picker", arr);
    return arr;
}


function teampickerNo(currentpool, teamlist, myteamcode){
    let arr = [];
    for (let [key, value] of Object.entries(teamlist)) {
        if(value[currentpool] > 0){
            arr.push(key);
        }
    }
    arr.filter(e => e != myteamcode);
    console.log("in team picker", arr);
    return arr;
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

    if(value != "Bangalore" || value != "Delhi" || value != "Hyderabad" || value != "Punjab" || value != "Kolkata" || value != "Mumbai" || value != "Chennai" || value != "Rajasthan" || value != "bangalore" || value != "delhi" || value != "hyderabad" || value != "punjab" || value != "kolkata" || value != "mumbai" || value != "chennai" || value != "rajasthan"){
        return "incorrect";
    }
    return value;
}



function delegateSlotCollection(){
    console.log("in delegateSlotCollection");
    console.log("current dialogState: "+this.event.request.dialogState);
      if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent=this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
      } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
      } else {
        console.log("in completed");
        console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
      }
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
alexa.registerHandlers(handlers, bidHandlers, gamehandlers, bidAgainHandlers, completeHandlers); 

// Start our Alexa code
alexa.execute(); 
  
});
