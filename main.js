const express = require("express");
const bodyParser = require("body-parser");
const validator = require("validator");
const TCMentor = require("./TCMentor");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 8900;

const TCMentorBot = new TCMentor();
app.post("/", (request, response) => {
  let team;
  const errorMessage = `*Hi <@${request.body.user_id}>!*, please provide a valid input.
\`/tc_mentor team [rubygems]\` *//get team info*
\`/tc_mentor user [adminemms@gmail.com]\` *//get this users team info*`;

  try {
    const input = request.body.text.split(" ");
    switch (input[0].toLowerCase()) {
      case "user":
        team = TCMentorBot.getTeamThoughMail(input[1]);
        return response.json({
          type: "mkdwn",
          text: team
        });
        break;
      case "team":
        team = TCMentorBot.getTeamByName(input[1]);
        return response.json({
          type: "mkdwn",
          text: team
        });
        break;
      case "teams":
        const teams = TCMentorBot.getAllTeam();
        return response.json({
          type: "mkdwn",
          text: teams
        });
      default:
        return response.json({
          type: "mkdwn",
          text: errorMessage})
        break;
    }
  } catch ({message}) {
    console.log(message);
    return response.json({
      type: "mkdwn",
      text: `It's seems the User/Team, you are looking for those not exist or you entered an invalid input.

*HINT!*
${errorMessage} `
    });
  }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
