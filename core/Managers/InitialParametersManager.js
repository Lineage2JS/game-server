const itemsManager = require('./ItemsManager');
const settings = require('./../../datapack/settings.json');

class InitialParametersManager {
  constructor() {
    this._initialEquipment = new Map();
  }
  
  enable() {
    this._loadInitialEquipment();
  }

  getInitialEquipmentIds(className) {
    return this._initialEquipment.get(className);
  }

  _loadInitialEquipment() {
    const initialEquipment = settings.initialEquipment;

    for(const className in initialEquipment) {
      const itemsName = initialEquipment[className];
      const itemsId = itemsName.map(itemName => {
        const itemId = itemsManager.getItemIdByName(itemName);

        return itemId;
      })

      this._initialEquipment.set(className, itemsId);
    }
  }
}

module.exports = new InitialParametersManager();