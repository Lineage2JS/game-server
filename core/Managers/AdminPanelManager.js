const fs = require('fs');
const path = require('path');

class AdminPanelManager {
  constructor() {
    this._htmlMessages = {};
  }
  
  enable() {
    const dir = path.join(process.cwd(), 'datapack/html/admin');

    fs.readdirSync(dir).forEach(file => {
      this._htmlMessages[file] = fs.readFileSync(path.join(dir, file), 'utf8');
    });
  }

  getHtmlMessageByFileName(fileName) {
    return this._htmlMessages[fileName];
  }
}

module.exports = new AdminPanelManager();