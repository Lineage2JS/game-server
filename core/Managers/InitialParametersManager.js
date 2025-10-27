const itemsManager = require('./ItemsManager');
const settings = require('./../../datapack/settings.json');

class InitialParametersManager {
  constructor() {
    this._initialEquipment = new Map();
    this._initialStartPoint = new Map();
  }
  
  enable() {
    this._loadInitialEquipment();
    this._loadInitialStartPoint();
  }

  getInitialEquipmentIds(className) {
    return this._initialEquipment.get(className);
  }

  getInitialStartPoint(className) {
    return this._initialStartPoint.get(className);
  }

  _loadInitialEquipment() {
    const initialEquipment = settings["initialEquipment"];

    for(const className in initialEquipment) {
      const itemsName = initialEquipment[className];
      const itemsId = itemsName.map(itemName => {
        const itemId = itemsManager.getItemIdByName(itemName);

        return itemId;
      })

      this._initialEquipment.set(className, itemsId);
    }
  }

  _loadInitialStartPoint() {
    const initialStartPoint = settings["initialStartPoint"];

    for(const className in initialStartPoint) {
      const points = initialStartPoint[className];

      this._initialStartPoint.set(className, points);
    }
  }
}

module.exports = new InitialParametersManager();