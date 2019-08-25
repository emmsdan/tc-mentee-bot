var SlackBot = require("slackbots")
var request = require("request")
var endpoint = "https://icanhazdadjoke.com/slack"

const envKey = process.env.JOKES_BOT_TOKEN

// create a bot
var bot = new SlackBot({
  token: envKey,
  name: "Jokes Bot"
})

bot.on("message", msg => {
    getRandomJoke(postMessage, msg.user)
})

const postMessage = (message, user) => {
  bot.postMessage(user, message, { as_user: true })
}

const getRandomJoke = (callback, user) => {
  return request(endpoint, (error, response) => {
    if (error) {
      console.log("Error: ", error)
    } else {
      let jokeJSON = JSON.parse(response.body)
      let joke = jokeJSON.attachments[0].text
      return callback(joke, user)
    }
  })
}
