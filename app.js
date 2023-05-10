const { App } = require("@slack/bolt");
const { WebClient } = require('@slack/web-api');
require("dotenv").config();
const schedule = require('node-schedule');
const axios = require('axios');

// - If app is installed, have it run on a schedule based on previous selection
//   - 8am, 12pm, 5pm. 
// If app is running reguarly, need to consume the first team name which is your team.
// Update for other game states.
// Add the ability to add custom emojis that the app can learn and remember.
// Could add new bot questions that allow for emoji to be added.
// Set expiration on status. ? 
// - Change to select menu
// - Deployt to production 
// - Create documentation for others to use. 
// - Deploy on portfolio
// - Somehow make it so you can run this locally and it will still work w/o bot.


// URL Update Locations - add /slack events.
// Interactivity & Shortcuts
// Slash Commands
// Event Subscriptions
// Select Menus? 


schedule.scheduleJob('0 9 * * *', async function () {
  console.log('The answer to life, the universe, and everything!');
  try {
    await retrieveMLBGame('New York Mets');
  } catch (error) {
    console.log("Unable to set timed status.");
    console.error(error);
  }
});


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/mlb", async ({ command, ack, say }) => {
  try {
    // Acknowledge the slash command request
    await ack();

    const history = await app.client.conversations.history({
      channel: command.channel_id,
    });

    console.log(history.messages[0].attachments[0].actions);
  } catch (error) {
    console.error(error);
  }
});


app.action({ callback_id: 'baseball_selection' }, async ({ action, ack, say }) => {
  console.log({ action });
  try {
    await ack();

    retrieveMLBGame(action.value);

  } catch (error) {
    console.error(error);
  }
});

async function retrieveMLBGame(team) {
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1`;
  const response = await axios.get(url).catch(error => console.error(error));

  let requestedGame;
  // account for double header by checking how many games, if more than 1, check if the first is finished
  // probably need to change requestedGame to an array to push double headers? 
  response.data.dates[0].games.forEach(game => {
    if (game.teams.away.team.name === team) {
      requestedGame = game;
    } else if (game.teams.home.team.name === team) {
      requestedGame = game;
    }
  });

  // Could respond in bot that says "No game today, do you want to display yesterday's game? or Tomorrow's game?"  Then pass in the date to the function.
  if (requestedGame === undefined) {
    statusText = `The ${team} do not play today. Tune back in tomorrow.`;
    return await sendStatusToSlack(statusText);
  };

  setUserStatus(requestedGame, team);
}

async function setUserStatus(game, team) {
  let chosenTeamData;
  let opponenTeamData;
  let atOrVsSymbol;

  if (game.teams.away.team.name === team) {
    atOrVsSymbol = "@";
    chosenTeamData = game.teams.away;
    opponentTeamData = game.teams.home;
  } else {
    atOrVsSymbol = "vs";
    chosenTeamData = game.teams.home;
    opponentTeamData = game.teams.away;
  }

  const date = new Date(game.gameDate);

  const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };

  // Output: 6:40:00 PM EDT
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  let statusText;

  switch (game.status.abstractGameState) {
    case 'Preview':
      statusText = `${chosenTeamData.team.name} ${atOrVsSymbol} ${opponentTeamData.team.name} ${formattedDate} `;

      return await sendStatusToSlack(statusText);
    case 'Live':
      const liveUrl = `https://statsapi.mlb.com${game.link}`;
      const liveResponse = await axios.get(liveUrl).catch(error => console.error(error));

      const inning = liveResponse.data.liveData.linescore.currentInningOrdinal;
      let inningHalf = liveResponse.data.liveData.linescore.inningHalf;

      if (inningHalf === 'Top') {
        inningHalf = 'T';
      } else {
        inningHalf = 'B';
      }
      statusText = `${chosenTeamData.team.name} ${chosenTeamData.score} - ${opponentTeamData.score} ${atOrVsSymbol} ${opponentTeamData.team.name} ${inningHalf}${inning}`;

      return await sendStatusToSlack(statusText);
    case 'Final':
      let outcomeSymbol;
      if (chosenTeamData.score > opponentTeamData.score) {
        outcomeSymbol = 'W';
      } else if (chosenTeamData.score === opponentTeamData.score) {
        outcomeSymbol = 'T';
      } else {
        outcomeSymbol = 'L';
      }
      statusText = `${team} ${outcomeSymbol}${chosenTeamData.score} - ${opponentTeamData.score} ${atOrVsSymbol} ${opponentTeamData.team.name}`;

      return await sendStatusToSlack(statusText);
    default:
      console.error('New Game State Found', game.status.abstractGameState)

      break;
  }
}

async function sendStatusToSlack(message) {
  try {
    await web.users.profile.set({
      profile: JSON.stringify({
        status_text: message,
        status_emoji: ':baseball:'
      })
    })
  } catch (error) {
    console.error(error);
  }
}



app.command("/help", async ({ command, ack, say, body, client }) => {
  try {
    // Acknowledge the slash command request
    await ack();

    // Send a message with a button element
    // const postResult = await say({
    //   blocks: [
    //     {
    //       type: "section",
    //       text: {
    //         type: "mrkdwn",
    //         text: "Pick a game to watch"
    //       },
    //       accessory: {
    //         type: "static_select",
    //         placeholder: {
    //           type: "plain_text",
    //           text: "Select a game",
    //           emoji: true
    //         },
    //         options: [
    //           {
    //             text: {
    //               type: "plain_text",
    //               text: "New York Mets vs. Philadelphia Phillies",
    //               emoji: true
    //             },
    //             value: "value-0"
    //           },
    //           {
    //             text: {
    //               type: "plain_text",
    //               text: "Miami Marlins vs. Atlanta Braves",
    //               emoji: true
    //             },
    //             value: "value-1"
    //           },
    //           {
    //             text: {
    //               type: "plain_text",
    //               text: "Washington Nationals vs. New York Yankees",
    //               emoji: true
    //             },
    //             value: "value-2"
    //           }
    //         ]
    //       }
    //     }
    //   ]
    // });
    const postResult = await client.chat.postMessage({
      channel: body.channel_id,
      text: 'Click the button to continue:',
      attachments: [
        {
          fallback: 'Button not supported',
          callback_id: 'baseball_selection',
          attachment_type: 'default',
          actions: [
            {
              name: 'mybutton',
              text: 'New York Mets',
              type: 'button',
              value: 'New York Mets',
              action_id: 'button_click',
              confirm: {
                title: 'Are you sure?',
                text: 'Ok with Mets?',
                ok_text: 'Yes',
                dismiss_text: 'No'
              }
            },
            {
              name: 'mybutton',
              text: 'Philadelphia Phillies',
              type: 'button',
              value: 'Philadelphia Phillies',
              action_id: 'button_click'
            },
            {
              name: 'mybutton',
              text: 'Miami Marlins',
              type: 'button',
              value: 'Miami Marlins',
              action_id: 'button_click'
            },
            {
              name: 'mybutton',
              text: 'New York Yankees',
              type: 'button',
              value: 'New York Yankees',
              action_id: 'button_click'
            },
            {
              name: 'mybutton',
              text: 'Oakland Athletics',
              type: 'button',
              value: 'Oakland Athletics',
              action_id: 'button_click'
            }
          ]
        },
      ]
    });

  } catch (error) {
    console.error(error);
  }
});


const web = new WebClient(process.env.SLACK_USER_TOKEN);

// Listen for incoming messages that are not from bots
app.message(async ({ message, command, say }) => {
  console.log(message);
  try {
    await web.users.profile.set({
      profile: JSON.stringify({
        status_text: message.text,
        status_emoji: ':speech_balloon:'
      })
    });
  } catch (error) {
    console.log("err")
    console.error(error);
  }
});

app.event('reaction_added', async ({ event, client }) => {
  console.log(event.item);
  try {
    // Check if the reaction was added to a message sent by the bot
    if (event.item.bot_id && event.item.bot_id === client.botId) {
      // Do something in response to the reaction
      console.log(`User ${event.user} reacted with ${event.reaction} to the bot's message.`);
    }
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  const port = 3000
  // Start your app
  try {
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  } catch (err) {
    console.log(err)
  }
})();