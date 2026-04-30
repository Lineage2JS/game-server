class EventBusNew {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(handler);
  }

  // off(event, handler) { // TODO как лучше для async операций?
  //   if (this.listeners.has(event)) {
  //     const handlers = this.listeners.get(event);
  //     const index = handlers.indexOf(handler);

  //     if (index !== -1) {
  //       handlers.splice(index, 1); // Вот тут
  //     }
  //   }
  // }

  emit(event, data) {
    if (this.listeners.has(event)) {
      const handlers = this.listeners.get(event);

      for (const handler of handlers) {
        handler(data);
      }
    }
  }  
}

module.exports = new EventBusNew();

// Сейчас есть
// player:enter
// player:move
// npc:died

// const Events = {
//   // Игрок
//   PLAYER_ENTER_WORLD: 'player:enterWorld',
//   PLAYER_LEAVE_WORLD: 'player:leaveWorld',
//   PLAYER_MOVE: 'player:move',
//   PLAYER_ATTACK: 'player:attack',
//   PLAYER_DAMAGE: 'player:damage',
//   PLAYER_DIE: 'player:die',
//   PLAYER_USE_ITEM: 'player:useItem',
// }

// NPC_SPAWN: 'npc:spawn',
//   NPC_DIE: 'npc:die',
  
//   // Бой
//   COMBAT_DAMAGE: 'combat:damage',
//   COMBAT_CRITICAL: 'combat:critical',
  
//   // Инвентарь
//   INVENTORY_ADD: 'inventory:add',
//   INVENTORY_REMOVE: 'inventory:remove',