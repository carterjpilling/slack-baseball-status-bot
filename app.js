const { App } = require("@slack/bolt");
const { WebClient } = require('@slack/web-api');
require("dotenv").config();
const schedule = require('node-schedule');
const axios = require('axios');

// G - If app is installed, have it run on a schedule based on previous selection
//   - 8am, 12pm, 5pm. 
// If app is running reguarly, need to consume the first team name which is your team.
// G Update for other game states.
// Add the ability to add custom emojis that the app can learn and remember.
// Could add new bot questions that allow for emoji to be added.
// Set expiration on status. ? 
// - Change to select menu
// - Deploy to production 
// - Create documentation for others to use. 
// - Deploy on portfolio
// - Somehow make it so you can run this locally and it will still work w/o bot.


// URL Update Locations - add /slack events.
// Interactivity & Shortcuts
// Slash Commands
// Event Subscriptions
// Select Menus? 

const teamNames = [
  'Arizona Diamondbacks',
  'Atlanta Braves',
  'Baltimore Orioles',
  'Boston Red Sox',
  'Chicago Cubs',
  'Chicago White Sox',
  'Cincinnati Reds',
  'Cleveland Guardians',
  'Colorado Rockies',
  'Detroit Tigers',
  'Houston Astros',
  'Kansas City Royals',
  'Los Angeles Angels',
  'Los Angeles Dodgers',
  'Miami Marlins',
  'Milwaukee Brewers',
  'Minnesota Twins',
  'New York Mets',
  'New York Yankees',
  'Oakland Athletics',
  'Philadelphia Phillies',
  'Pittsburgh Pirates',
  'San Diego Padres',
  'San Francisco Giants',
  'Seattle Mariners',
  'St. Louis Cardinals',
  'Tampa Bay Rays',
  'Texas Rangers',
  'Toronto Blue Jays',
  'Washington Nationals'
];


schedule.scheduleJob('0 9,22 * * *', async function () {
  console.log('The answer to life, the universe, and everything!');
  try {
    const userProfile = await web.users.profile.get();
    const userStatus = userProfile.profile.status_text;
    const firstTeam = teamNames.find(team => userStatus.includes(team));
    await retrieveMLBGame(firstTeam);
  } catch (error) {
    console.log("Unable to set timed status.");
    console.error(error);
  }
});


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/history", async ({ command, ack, say }) => {
  try {
    // Acknowledge the slash command request
    await ack();


    console.log('firstTeam', firstTeam);
  }

  catch (error) {
    console.error('error', error);
  }
});

app.command("/mlb", async ({ text, command, ack, say }) => {
  try {
    // Acknowledge the slash command request
    await ack();

    const postResult = await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Pick a team for your status"
          },
          accessory: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a game",
            },
            action_id: "baseball_dropdown",
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Arizona Diamondbacks",
                },
                value: "Arizona Diamondbacks"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Atlanta Braves",
                },
                value: "Atlanta Braves"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Baltimore Orioles",
                },
                value: "Baltimore Orioles"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Boston Red Sox",
                },
                value: "Boston Red Sox"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Chicago Cubs",
                },
                value: "Chicago Cubs"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Chicago White Sox",
                },
                value: "Chicago White Sox"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Cincinnati Reds",
                },
                value: "Cincinnati Reds"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Cleveland Guardians",
                },
                value: "Cleveland Guardians"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Colorado Rockies",
                },
                value: "Colorado Rockies"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Detroit Tigers",
                },
                value: "Detroit Tigers"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Houston Astros",
                },
                value: "Houston Astros"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Kansas City Royals",
                },
                value: "Kansas City Royals"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Los Angeles Angels",
                },
                value: "Los Angeles Angels"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Los Angeles Dodgers",
                },
                value: "Los Angeles Dodgers"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Miami Marlins",
                },
                value: "Miami Marlins"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Milwaukee Brewers",
                },
                value: "Milwaukee Brewers"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Minnesota Twins",
                },
                value: "Minnesota Twins"
              },
              {
                text: {
                  type: "plain_text",
                  text: "New York Mets",
                },
                value: "New York Mets"
              },
              {
                text: {
                  type: "plain_text",
                  text: "New York Yankees",
                },
                value: "New York Yankees"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Oakland Athletics",
                },
                value: "Oakland Athletics"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Philadelphia Phillies",
                },
                value: "Philadelphia Phillies"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Pittsburgh Pirates",
                },
                value: "Pittsburgh Pirates"
              },
              {
                text: {
                  type: "plain_text",
                  text: "San Diego Padres",
                },
                value: "San Diego Padres"
              },
              {
                text: {
                  type: "plain_text",
                  text: "San Francisco Giants",
                },
                value: "San Francisco Giants"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Seattle Mariners",
                },
                value: "Seattle Mariners"
              },
              {
                text: {
                  type: "plain_text",
                  text: "St. Louis Cardinals",
                },
                value: "St. Louis Cardinals"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Tampa Bay Rays",
                },
                value: "Tampa Bay Rays"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Texas Rangers",
                },
                value: "Texas Rangers"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Toronto Blue Jays",
                },
                value: "Toronto Blue Jays"
              },
              {
                text: {
                  type: "plain_text",
                  text: "Washington Nationals",
                },
                value: "Washington Nationals"
              }
            ]
          }
        }
      ]
    });
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


app.action('baseball_dropdown', async ({ payload, action, ack, say }) => {
  console.log({ payload });
  try {
    await ack();

    retrieveMLBGame(payload.selected_option.value);

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
  let opponentTeamData;
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
        status_emoji: ':baseball:',
        status_expiration: (Date.now() / 1000) + 60 * 60 * 24,
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