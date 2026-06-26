/** @typedef {{ id: number, numberState: number, isCompleted: boolean }} Quest */

class Quests {
  constructor() {
    /** @type {Quest[]} */
    this._quests = [];
  }

  /** @param {number} questId */
  addQuest(questId) {
    /** @type {Quest} */
    const quest = {
      id: questId,
      numberState: 1,
      isCompleted: false
    };

    this._quests.push(quest);
  }

  /** @returns {Quest[]} */
  getQuests() {
    return this._quests;
  }
}

module.exports = Quests;