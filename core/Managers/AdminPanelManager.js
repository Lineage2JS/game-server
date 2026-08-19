const fs = require('fs');
const path = require('path');

class AdminPanelManager {
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
    const dir = path.join(process.cwd(), 'datapack/html/admin'); // TODO enable()
    const content = fs.readFileSync(path.join(dir, `${fileName}.htm`), 'utf8');

    return content;
  }
}

// singleton
module.exports = new AdminPanelManager();