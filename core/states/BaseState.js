class BaseState {
  constructor(character, payload = {}) {
    this.character = character;
    this.payload = payload;

    /*
    payload = {
      state: 'cast',
      data
    }

    Нужна модель

    class BasePayload {}
    class CastPayload extends BasePayload {}
    */
  }

  enter() {

  }

  update() {

  }

  leave() {
    
  }
}

module.exports = BaseState;