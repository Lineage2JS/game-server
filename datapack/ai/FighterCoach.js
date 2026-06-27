const GuildCoach = require('./GuildCoach');

class FighterCoach extends GuildCoach {
  /**
   * @param {*} talker
   */
  onLearnSkillRequested(talker) {
    this.showSkillList(talker);
  }
}

module.exports = FighterCoach;