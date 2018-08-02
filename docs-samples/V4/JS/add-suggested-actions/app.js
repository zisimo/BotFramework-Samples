/*
 * Botbuilder v4 SDK - Add suggested actions
 * 
 * This bot shows buttons the user can press to provide input. These SuggestedActions buttons will disappear 
 * after the user clicked on any of the buttons. The text value of the button will be sent as a message to 
 * the bot representing the user's choice. The bot can take action based this choice.
 * 
 * To run this bot:
 * 1) install these npm packages:
 * npm install --save restify
 * npm install --save botbuilder@preview
 * 
 * 2) From VSCode, open the package.json file and
 * Update the property "main" to the name of the sample bot you want to run. 
 *    For example: "main": "add-suggested-actions/app.js" to run the this sample bot.
 * 3) run the bot in debug mode. 
 * 4) Load the emulator and point it to: http://localhost:3978/api/messages
 * 5) Send the message "hi" to engage with the bot to see the suggested actions.
 *
 */ 

const { BotFrameworkAdapter, MessageFactory, MemoryStorage, UserState, BotStateSet, ConversationState } = require('botbuilder');
const restify = require('restify');

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Flags
var asked_question = false;

// Storage
const storage = new MemoryStorage(); // Volatile memory
const conversationState = new ConversationState(storage);
adapter.use(new BotStateSet(conversationState));

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context) => {

        const isMessage = (context.activity.type === 'message');
        // State will store all of your information 
        const convo = conversationState.get(context);

        if (isMessage) {

            //Define topicStates object if it doesn't exist in convo state.
            if(!convo.topicStates){
                // Define a default state object. Once done, reset back to undefined.
                convo.topicStates = {
                    "askedQuestion": false
                }
            }

            if(!convo.topicStates.askedQuestion){
                // Set the flag to true
                convo.topicStates.askedQuestion = true;

                //  Initialize the message object.
                const basicMessage = MessageFactory.suggestedActions(['red', 'green', 'blue'], 'Choose a color');
                await context.sendActivity(basicMessage);
            } else {
                convo.topicStates.askedQuestion = false;
                await context.sendActivity(`You picked the color ${context.activity.text}`);
            };
        };
    });
});