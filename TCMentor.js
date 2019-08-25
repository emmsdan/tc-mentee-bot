const fs = require("fs");

module.exports = class TCMentor {
  constructor() {
    this.generalTeams = [];
    this.mentors = this.getFile("mentors");
    this.mentees = this.getFile("mentees");
    this.teams = this.getFile("teams");
  }

  getFile(filename) {
    return fs.readFileSync(`${filename}.json`, "utf8");
  }

  generateTeams(mentors, mentees, groups) {
    this.setMentee(mentors, mentees, groups);
    if (mentors.length > 0) {
      return this.generateTeams(mentors, mentees, groups);
    }
    return this.generalTeams;
  }

  setMentee(mentors, mentees, groups) {
    const mentor = mentors.length;
    let menteeSize = mentees.length / mentor;
    menteeSize = menteeSize * mentor - menteeSize;

    const mentee = mentees.splice(menteeSize).map(st => {
      return { name: st.name, email: st.email, github: st.github };
    });
    return this.generalTeams.push({
      ...groups.pop(),
      mentor: mentors.pop(),
      mentees: mentee
    });
  }

  getDetails() {
    const mentors = this.toJSON(this.mentors);
    const mentees = this.toJSON(this.mentees);
    const teams = this.toJSON(this.teams);

    return this.generateTeams(mentors, mentees, teams);
  }

  toJSON(text) {
    return JSON.parse(text);
  }
  getTeamsDetail() {
    return this.getDetails();
  }
  myTeam(value, type) {

    return this.getDetails().find(teams => {
      const user = teams.mentees.filter(mente => {
        return mente[type].toLowerCase() === value.toLowerCase();
      });
      if (user.length === 1) {
        return teams;
      }
    });
  }
  getTeamByName(value) {
    let team = this.getDetails().find(
      teams => teams.team.toLowerCase() === value.toLowerCase()
    );

    if (!team) {
      return "*We could not find this user in our List.*";
    }
    return this.formatTeam(team);
  }
  getTeamThoughMail(email) {
    const team = this.myTeam(email, "email");
    if (!team) {
      return "*We could not find this user in our List.*";
    }
    return this.formatTeam(team);
  }
  formatTeam(team) {
    let teamInfo = `
      *MENTOR:* ${team.mentor.name}
      *TEAM:* ${team.team}
      *TEAM MEMBERS:*
      `;
    const mentees = team.mentees.map(mentee => {
      return `*${mentee.name}*  ---- ${mentee.github} 
        `;
    });
    for (let mentee of mentees) {
      teamInfo += mentee;
    }
    return teamInfo;
  }
  getAllTeam () {
    let teams = '';
    for (let team of this.toJSON(this.teams)) {
      teams += this.getTeamByName(team.team);
    }
    return teams;
  }
};
