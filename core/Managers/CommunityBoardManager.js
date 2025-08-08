const fs = require('fs');
const path = require('path');

class CommunityBoardManager {
  getHtmlMessageByFileName(fileName) {
    const htmlMessage = this._getFileContentByFileName(fileName);

    return htmlMessage;
  }

  _getFileContentByFileName(fileName) {
    const dir = path.join(process.cwd(), 'datapack/html/community');
    const content = fs.readFileSync(path.join(dir, `${fileName}.htm`), 'utf8');

    return content;
  }
}

module.exports = new CommunityBoardManager();