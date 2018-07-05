const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

var tellingStory = false;
var tellStory;
const TOKEN = config.token;
var testID = config.testID;
const prefix = config.prefix;
var badwords = config.badWords;
var stories = config.stories;

/////    STORY FUNCTIONS     /////////////////////////////////////////////////////////////////////////                
function startTelling(){
    storyTime();
    if(tellingStory == false){
        tellStory = setInterval(storyTime, 1800000);
        tellingStory = true;
    }
}
function stopTelling(){
    tellingStory = clearInterval();
    tellingStory = false;
}

function storyTime(){
    var random = Math.floor(Math.random() * stories.length-1) + 1;  //1 - num of stories
    bot.channels.get(testID).send(stories[random]);
}

/////////  GENERATE WELCOME MESSAGE  /////////////////////////////////////////////////////////////////
function randomWelcomeMessage(){
    var random = Math.floor(Math.random() * 100) + 1;   //1-100
    
    if(random >= 90){
        return "Hey everybody! Check out my package!";
    }
    else if(random >= 75){
        return "HOLY SH*T! IT ACTUALLY WORKED! \nHI GUYYYYYS!";
    }
    else if(random >= 50){
        return "Look out everybody! Things are about to get awesome!";
    }
    else if(random >= 25){
        return "This time it'll be awesome, I promise!";
    }
    else{
        return "Let's get this party started!";
    }
}
/////// BOT REACTS TO MESSAGES //////////////////////////////////////////////////////////////////////////                
bot.on('message', function(message){
    if(message.author.bot) return;

    if(message.content.startsWith(prefix)){
        splitword = message.content.slice(prefix.length).trim().split(/ +/g);
        command = splitword.shift().toLowerCase();

        if(command == 'storystart'){
            startTelling();
        }
        else if(command == 'storystop'){
            stopTelling();
            bot.channels.get(message.channel.id).send("Okay...");
        }
        else{
            console.log();
            bot.channels.get(message.guild.id).send("Error! Command not found. Check syntax.");
        }
    }
    else{
        if(badwords.some(el => message.content.toLowerCase().includes(el))){
            message.reply("\No, u!");
        }
        else if(message.content.toLowerCase() == "hello"){
            message.reply("\nHello, my minion!");
        }
        else if(message.content.toLowerCase().includes("no, u") ){
            message.reply("hehehe easily triggered minion :')");
        }
    }
});
//////  USER JOIN CHANNEL MESSAGE //////////////////////////////////////////////////////////////////////
bot.on('guildMemberAdd', (gMembAdd) => {
    gMembAdd.send(`Hi ${gMembAdd.toString()} Welcome to the server!!`).then(msg => {
        msg.react('✅');
    })
});

////// USER LEAVES CHANNEL MESSAGE /////////////////////////////////////////////////////////////////////
bot.on('guildMemberRemove', (gMembRemove) => {
    gMembRemove.send(`Hi ${gMembRemove.toString()} rage quits fro the server...`).then(msg => {
        msg.react('X'); 
        //fix emoji
    })
});

///////  BOT STARTS UP   ///////////////////////////////////////////////////////////////////////////////
bot.on('ready', message => {
    console.log(`Logged in as ${bot.user.tag}!`);
    var guildList = bot.guilds.array();
    //.defaultChannel is deprecated and will be most likely removed in v12
    //use a list of channels to send with 
    //  bot.channels.get(_channelID).send(_message);
    //temporary solution
    try {
        guildList.forEach(guild => guild.defaultChannel.send(randomWelcomeMessage()));
    } 
    catch (err) {
        console.log("Could not send message to " + guild.name);
    }
    /*
    note1:  <client>.guilds has a collection of all the guildobjects
            can iterate over that with a for.. of collection.values() loop
            then filter guild.channels for guild.me.hasPermission() check for VIEW_CHANNEL and SEND_MESSAGES
            then check names if you want to, maybe sort them by position, whatever goats your float
            at some point get the .first() element of the collection and send to it.
    
    note2:  why don't you make a command for setting the channel to send messages to?
            that way someone can exec a command like "%setchannel" and you can use the channel they give.
    
    */
});



bot.login(TOKEN);