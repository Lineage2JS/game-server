class MovingManager {
  constructor() {
    this._movingObjects = [];
    this._lastUpdateTime = Date.now();
  }

  registerMovingObject(object) {
    const movingObject = this._movingObjects.find(movingObject => movingObject.object === object);

    if (!movingObject) {
      this._movingObjects.push({
        object,
        isMovementEnabled: true
      });
    } else {
      movingObject.isMovementEnabled = true;
    }
  }

  unregisterMovingObject(object) {
    const movingObject = this._movingObjects.find(movingObject => movingObject.object === object);

    if (movingObject) {
      movingObject.isMovementEnabled = false;
    }
  }

  enable() {
    this._updateMovingObjects();
  }

  _updateMovingObjects() {
    this._lastUpdateTime = Date.now();

    if (this._movingObjects.length > 0) {
      const movingObjects = this._movingObjects.filter(movingObject => movingObject.isMovementEnabled);

      for(let i = 0; i < movingObjects.length; i++) {
        const movingObject = movingObjects[i];

        if (movingObject.isMovementEnabled) {
          movingObject.object.updatePosition(this._lastUpdateTime);

          // two methods?
          // updatePosition
          // updateLastTimeUpdatePosition?
        }
      }
    }

    setTimeout(this._updateMovingObjects.bind(this), 100);
  }
}

module.exports = new MovingManager();