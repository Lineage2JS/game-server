const fs = require('fs');
const path = require('path');

class NpcHtmlMessagesManager {
  constructor() {
    this._messages = {};
  }

  getHtmlMessageByFileName(fileName) {
    return this._messages[fileName];
  }

  enable() {
    const dir = path.join(process.cwd(), 'Data/html/npc');

    fs.readdirSync(dir).forEach(file => {
      this._messages[file] = fs.readFileSync(path.join(dir, file), 'utf8');
    });
  }
}

module.exports = new NpcHtmlMessagesManager();