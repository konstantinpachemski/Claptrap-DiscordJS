const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

var tellingStory = false;
var tellStory; //req

const TOKEN = config.token; //configure config.json to function
var testID = config.testID; //configure config.json to function
const prefix = config.prefix;
var badwords = config.badWords;
var stories = config.stories; 
var welcomeMessages = config.welcomeMessages;

// STORY FUNCTIONALITIES               
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
    var random = Math.floor(Math.random() * stories.length-1) + 1;
    bot.channels.get(testID).send(stories[random]);
}

// WELCOME
function randomWelcomeMessage(){
    var random = Math.floor(Math.random() * 100) + 1;   //1-100
    
    if(random >= 90){
        return welcomeMessages[0];
    }
    else if(random >= 75){
        return welcomeMessages[1];
    }
    else if(random >= 50){
        return welcomeMessages[2];
    }
    else if(random >= 25){
        return welcomeMessages[3];
    }
    else{
        return welcomeMessages[4];
    }
}
// COMMANDS             
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
        if(badwords.some(word => message.content.toLowerCase().includes(word))){
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
// USER JOIN CHANNEL
bot.on('guildMemberAdd', (gMembAdd) => {
    gMembAdd.send(`Hi ${gMembAdd.toString()} Welcome to the server!!`).then(msg => {
        msg.react('✅');
    })
});

// USER LEAVES CHANNEL
bot.on('guildMemberRemove', (gMembRemove) => {
    gMembRemove.send(`Hi ${gMembRemove.toString()} rage quited. Who got this lad mad?`).then(msg => {
        msg.react('❌');
    })
});

// BOT READY
bot.on('ready', message => {
    console.log(`Logged in as ${bot.user.tag} and ready!`);
    var guildList = bot.guilds.array();
    
    try {
        guildList.forEach(guild => guild.defaultChannel.send(randomWelcomeMessage()));
        /*
        this solution is made to work for one server only
        .defaultChannel is deprecated and will be most likely removed in v12
        use a list of channels to send with 
        bot.channels.get(_channelID).send(_message); 
        */
    } 
    catch (err) {
        console.log("Could not send message to " + guild.name);
    }
});

bot.login(TOKEN);


    /*
    TO-DO 1:
        <client>.guilds has a collection of all the guildobjects
        can iterate over that with a for.. of collection.values() loop
        then filter guild.channels for guild.me.hasPermission() 
        check for VIEW_CHANNEL and SEND_MESSAGES
        then check names if you want to, maybe sort them by position, whatever goats your float
        at some point get the .first() element of the collection and send to it.
    
    TO-DO 2:  
        Do a command for bot to SET the channel that will send messages to.
        "!setchannel"
    */