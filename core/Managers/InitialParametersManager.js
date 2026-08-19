const itemsManager = require('./ItemsManager');
const settings = require('./../../datapack/settings.json');
/** @typedef {[number, number, number]} Point */

class InitialParametersManager {
  constructor() {
    /** @type {Map<string, number[]>} */
    this._initialEquipment = new Map();
    /** @type {Map<string, Point[]>} */
    this._initialStartPoint = new Map();
  }

  /** @returns {void} */
  enable() {
    this._loadInitialEquipment();
    this._loadInitialStartPoint();
  }

  /**
   * @param {string} className
   * @returns {number[] | undefined}
   */
  getInitialEquipmentIds(className) {
    return this._initialEquipment.get(className);
  }

  /**
   * @param {string} className
   * @returns {Point[] | undefined}
   */
  getInitialStartPoint(className) {
    return this._initialStartPoint.get(className);
  }

  /** @returns {void} */
  _loadInitialEquipment() {
    const initialEquipment = settings["initialEquipment"];

    for(const className in initialEquipment) {
      const itemNames = (initialEquipment[/** @type {keyof typeof initialEquipment} */ (className)]);
      const itemsId = itemNames.map(itemName => {
        const itemId = itemsManager.getItemIdByName(itemName);

        return itemId;
      })

      this._initialEquipment.set(className, itemsId);
    }
  }

  /** @returns {void} */
  _loadInitialStartPoint() {
    const initialStartPoint = settings["initialStartPoint"];

    for(const className in initialStartPoint) {
      const points = initialStartPoint[/** @type {keyof typeof initialStartPoint} */ (className)];

      this._initialStartPoint.set(className, /** @type {Point[]} */ (points));
    }
  }
}

module.exports = new InitialParametersManager();