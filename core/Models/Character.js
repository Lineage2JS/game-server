const baseStats = require('./../../datapack/baseStats.json');
const EventEmitter = require('events');

class Character extends EventEmitter {
  constructor() {
    super();
    
    this.objectId = null; // getObjectId()
    this.login = null;
    this.characterName = null;
    this.title = "";
    this.level = 1;
    this.gender = null;
    this.hairStyle = null;
    this.hairColor = null;
    this.face = null;
    this.heading = 0;
    this.accessLevel = 0;
    this.online = false;
    this.onlineTime = 0;
    this.clanId = 0;
    this.clanLeader = 0;
    this.clanCrestId = 0;
    this.allianceId = 0;
    this.allianceCrestId = 0;
    this.gm = 0;
    this.privateStoreType = 0;
    this.exp = 0;
    this.sp = 0;

    this.pvp = 0;
    this.pk = 0;
    this.karma = 0;

    this.classId = null;
    this.className = null;
    this.raceId = null;
    
    this.str = null;
    this.dex = null;
    this.con = null;
    this.int = null;
    this.wit = null;
    this.men = null;
    this.hp = null;
    this.maximumHp = null;
    this.mp = null;
    this.maximumMp = null;

    this.pAtk = null;
    this.pDef = null;
    this.mAtk = null;
    this.mDef = null;
    this.pSpd = null;
    this.mSpd = null;
    this.accuracy = null;
    this.critical = null;
    this.evasion = null;
    this.baseRunSpeed = null;
    this.baseWalkSpeed = null;
    this.swimSpeed = null;
    this.maximumLoad = null;
    
    this.x = null;
    this.y = null;
    this.z = null;
    
    this.canCraft = null;
    
    this.maleAttackSpeedMultiplier = null;
    this.maleCollisionRadius = null;
    this.maleCollisionHeight = null;
    
    this.femaleAttackSpeedMultiplier = null;
    this.femaleCollisionRadius = null;
    this.femaleCollisionHeight = null;
    
    this.items = [];
    this.path = {
      target: {
        x: null,
        y: null,
        z: null
      },
      origin: {
        x: null,
        y: null,
        z: null
      }
    }

    this.underwear = { objectId: 0, itemId: 0 } // TODO papperdoll system?
    this.ear = {
      left: { objectId: 0, itemId: 0 },
      right: { objectId: 0, itemId: 0 }
    }
    this.neck = { objectId: 0, itemId: 0 }
    this.finger = {
      left: { objectId: 0, itemId: 0 },
      right: { objectId: 0, itemId: 0 }
    }
    this.head = { objectId: 0, itemId: 0 }
    this.hand = {
      left: { objectId: 0, itemId: 0 },
      right: { objectId: 0, itemId: 0 },
      leftAndRight: { objectId: 0, itemId: 0 }
    } // leftHand, rightHand, twoHand?
    this.gloves = { objectId: 0, itemId: 0 }
    this.chest = { objectId: 0, itemId: 0 }
    this.legs = { objectId: 0, itemId: 0 }
    this.feet = { objectId: 0, itemId: 0 }
    this.back = { objectId: 0, itemId: 0 }

    //
    this.target = null; // target and aggroTarget?
    this.createdAt = null;
    this._attackers = new Set();
    this._moveType = 0;
    //
  }

  takeDamage(damage) {
    //this.addAttacker(character);
    
    this.hp = this.hp - damage;

    this.emit('damaged');
  }

  addAttacker(character) {
    this._attackers.add(character)
  }

  getAttackers() {
    return this._attackers;
  }

  getMoveType() {
    return this._moveType;
  }

  setMoveType(moveType) {
    this._moveType = moveType;
  }

  getMoveSpeed() {
    if (this.getMoveType() === 1) { // TODO magic number
      return this.runSpeed;
    } else {
      return this.walkSpeed;
    }
  }

  get runSpeed() {
    return Math.round(this.baseRunSpeed * baseStats.DEX[this.dex]);
  }

  get walkSpeed() {
    return Math.round(this.baseWalkSpeed * baseStats.DEX[this.dex]);
  }

  get movementMultiplier() {
    const multiplier = this.runSpeed / this.baseRunSpeed;
    const roundedMultiplier = multiplier.toFixed(1);
    
    return parseFloat(roundedMultiplier);
  };

  get attackSpeed() {
    return Math.round(this.baseAttackSpeed * baseStats.DEX[this.dex]);
  }

  get attackSpeedMultiplier() {
    const multiplier = ((1.1) * this.attackSpeed / this.baseAttackSpeed)
    const roundedMultiplier = multiplier.toFixed(1);
    
    return parseFloat(roundedMultiplier);
  };

  static create(template) {
    const character = new Character();

    for(const key in template) {
      if (character.hasOwnProperty(key)) {
        character[key] = template[key];
      }
    }

    return character;
  }
}

module.exports = Character;