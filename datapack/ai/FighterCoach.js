const GuildCoach = require('./GuildCoach');

class FighterCoach extends GuildCoach {
  onLearnSkillRequested(talker) {
    this.showSkillList(talker);
  }
}

module.exports = FighterCoach;