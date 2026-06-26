const fs = require('fs');
const path = require('path');

class CommunityBoardManager {
  /**
   * @param {string} fileName
   * @returns {string}
   */
  getHtmlMessageByFileName(fileName) {
    const htmlMessage = this._getFileContentByFileName(fileName);

    return htmlMessage;
  }

  /**
   * @param {string} fileName
   * @returns {string}
   */
  _getFileContentByFileName(fileName) {
    const dir = path.join(process.cwd(), 'datapack/html/community');
    const content = fs.readFileSync(path.join(dir, `${fileName}.htm`), 'utf8');

    return content;
  }
}

module.exports = new CommunityBoardManager();