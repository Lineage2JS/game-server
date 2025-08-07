const EventEmitter = require('events');

class RegenerationManager extends EventEmitter {
  constructor() {
    super();

    this._regenerationObjects = [];
    this._lastUpdateTime = Date.now();
  }

  addCharacter(character) {
    this._regenerationObjects.push({
      object: character
    })
  }

  enable() {
    this._updateRegenerationObjects();
  }

  _updateRegenerationObjects() {
    this._lastUpdateTime = Date.now();

    if (this._regenerationObjects.length > 0) {
      const regenerationObjects = this._regenerationObjects //.filter(regenerationObject => regenerationObject.isMovementEnabled);

      for(let i = 0; i < regenerationObjects.length; i++) {
        const regenerationObject = regenerationObjects[i];

        //if (regenerationObject.isMovementEnabled) {
          //regenerationObject.object.updatePosition(this._lastUpdateTime);

          regenerationObject.object.regenerate(); // fix
          // character.updatePosition?
        //}
      }
    }

    setTimeout(this._updateRegenerationObjects.bind(this), 3000);
  }
}

module.exports = new RegenerationManager();