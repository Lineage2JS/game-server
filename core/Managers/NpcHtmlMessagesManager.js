const fs = require('fs');
const path = require('path');

class NpcHtmlMessagesManager {
  constructor() {
    /** @type {Record<string, string>} */
    this._messages = {};
  }

  /**
   * @param {string} fileName
   * @returns {string | undefined}
   */
  getHtmlMessageByFileName(fileName) {
    return this._messages[fileName];
  }

  /** @returns {void} */
  enable() {
    const dir = path.join(process.cwd(), 'datapack/html/npc');

    /** @param {string} file */
    fs.readdirSync(dir).forEach(file => {
      this._messages[file] = fs.readFileSync(path.join(dir, file), 'utf8');
    });
  }
}

module.exports = new NpcHtmlMessagesManager();