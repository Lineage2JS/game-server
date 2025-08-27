const Merchant = require('./Merchant');

class Silvia extends Merchant {
  constructor(props) {
    super(props);

    this.sellList0 = [
      {"necklace_of_magic": 15},
      {"necklace_of_knowledge": 15},
      {"necklace_of_anguish": 15},
      {"necklace_of_wisdom": 15},
      {"apprentice's_earing": 15},
      {"mage_earing": 15},
      {"earing_of_strength": 15},
      {"earing_of_wisdom": 15},
      {"cat'seye_earing": 15},
      {"magic_ring": 15},
      {"ring_of_knowledge": 15},
      {"ring_of_anguish": 15},
      {"ring_of_wisdom": 15},
      {"wooden_arrow": 15},
      {"bone_arrow": 15},
      {"world_map": 15},
      {"key_of_thief": 15},
      {"spirit_ore": 15},
      {"soul_ore": 15},
      {"blessed_spiritshot_none": 15},
      {"spiritshot_none": 15},
      {"soulshot_none": 15},
      {"scroll_of_escape": 15},
      {"lesser_healing_potion": 15},
      {"antidote": 15},
      {"bandage": 15},
      {"quick_step_potion": 15},
      {"swift_attack_potion": 15},
    ];
  }
}

module.exports = Silvia;