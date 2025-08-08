const Citizen = require('./Citizen');

class Carl extends Citizen {
  onTalkSelected(talker) {
    if (this.haveMemo(talker, 201) === 0
      && this.getOneTimeQuestFlag(talker, 201) === 0
      && talker.level < 10
      && talker.className === 'Human Fighter'
    ) {
      
      // deleteRadar's
      this.showPage(talker, 'carl_q0201_01.htm');
      this.setMemo(talker, 201); // hfighter_tutorial id
      this.soundEffect(talker, 'ItemSound.quest_accept');
      this.showQuestionMark(talker, 12);
      this.showRadar(talker, -73403, 255947, -3126);

      return;
    } else if (talker.className !== 'Human Fighter') {
      this.showPage(talker, 'carl_q0201_06.htm');

      return;
    } else if (talker.level >= 10) {
      this.showPage(talker, 'carl_q0201_05.htm');

      return;
    }

    if (this.haveMemo(talker, 201) === 1
      && this.ownItemCount(talker, 'recommendation_01') === 0) {
      if (this.ownItemCount(talker, 'fox_fang1') === 4) {
        this.deleteItem(talker, 'fox_fang1', this.ownItemCount(talker, 'fox_fang1'));
        this.giveItem(talker, 'recommendation_01', 1);
        
        // fix
        setTimeout(() => {
          this.giveItem(talker, 'world_map', 1);
        }, 100);
        
        this.showPage(talker, 'carl_q0201_02.htm');
        // deleteRadar's
        this.showRadar(talker, -71073, 258711, -3099);
        // fix
        const quests = talker.getQuests();
        const quest = quests.find(quest => quest.id === 201);

        quest.isCompleted = true;
        //
      } else if (this.ownItemCount(talker, 'fox_fang1') < 4) {
        this.showPage(talker, 'carl_q0201_03.htm');
      }
    }
    
    if (this.haveMemo(talker, 201) === 1
      && this.ownItemCount(talker, 'recommendation_01') === 1) {
      this.showPage(talker, 'carl_q0201_04.htm');

      return;
    }
  }
}

module.exports = Carl;