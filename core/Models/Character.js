const baseStats = require('./../../datapack/baseStats.json');
const eventBusNew = require('./../Events/EventBusNew');
const EventEmitter = require('events');

class Character extends EventEmitter {
  constructor() {
    super();

    /** @type {number | null} */
    this.objectId = null; // getObjectId()
    /** @type {string | null} */
    this.login = null;
    /** @type {string | null} */
    this.characterName = null;
    /** @type {string} */
    this.title = "";
    /** @type {number} */
    this.level = 1;
    /** @type {number | null} */
    this.gender = null;
    /** @type {number | null} */
    this.hairStyle = null;
    /** @type {number | null} */
    this.hairColor = null;
    /** @type {number | null} */
    this.face = null;
    /** @type {number} */
    this.heading = 0;
    /** @type {boolean} */
    this.isDead = false;
    /** @type {number} */
    this.accessLevel = 0;
    /** @type {boolean} */
    this.online = false;
    /** @type {number} */
    this.onlineTime = 0;
    /** @type {number} */
    this.clanId = 0;
    /** @type {number} */
    this.clanLeader = 0;
    /** @type {number} */
    this.clanCrestId = 0;
    /** @type {number} */
    this.allianceId = 0;
    /** @type {number} */
    this.allianceCrestId = 0;
    /** @type {number} */
    this.gm = 0;
    /** @type {number} */
    this.privateStoreType = 0;
    /** @type {number} */
    this.exp = 0;
    /** @type {number} */
    this.sp = 0;

    /** @type {number} */
    this.pvp = 0;
    /** @type {number} */
    this.pk = 0;
    /** @type {number} */
    this.karma = 0;

    /** @type {number | null} */
    this.classId = null;
    /** @type {string | null} */
    this.className = null;
    /** @type {number | null} */
    this.raceId = null;

    /** @type {number | null} */
    this.str = null;
    /** @type {number | null} */
    this.dex = null;
    /** @type {number | null} */
    this.con = null;
    /** @type {number | null} */
    this.int = null;
    /** @type {number | null} */
    this.wit = null;
    /** @type {number | null} */
    this.men = null;
    /** @type {number | null} */
    this.hp = null;
    /** @type {number | null} */
    this.maximumHp = null;
    /** @type {number | null} */
    this.mp = null;
    /** @type {number | null} */
    this.maximumMp = null;

    /** @type {number | null} */
    this.pAtk = null;
    /** @type {number | null} */
    this.pDef = null;
    /** @type {number | null} */
    this.mAtk = null;
    /** @type {number | null} */
    this.mDef = null;
    /** @type {number | null} */
    this.pSpd = null;
    /** @type {number | null} */
    this.mSpd = null;
    /** @type {number | null} */
    this.accuracy = null;
    /** @type {number | null} */
    this.critical = null;
    /** @type {number | null} */
    this.evasion = null;
    /** @type {number | null} */
    this.baseRunSpeed = null;
    /** @type {number | null} */
    this.baseWalkSpeed = null;
    /** @type {number | null} */
    this.baseAttackSpeed = null;
    /** @type {number | null} */
    this.swimSpeed = null;
    /** @type {number | null} */
    this.maximumLoad = null;

    /** @type {number | null} */
    this.x = null;
    /** @type {number | null} */
    this.y = null;
    /** @type {number | null} */
    this.z = null;

    /** @type {boolean | null} */
    this.canCraft = null;

    /** @type {number | null} */
    this.maleAttackSpeedMultiplier = null;
    /** @type {number | null} */
    this.maleCollisionRadius = null;
    /** @type {number | null} */
    this.maleCollisionHeight = null;

    /** @type {number | null} */
    this.femaleAttackSpeedMultiplier = null;
    /** @type {number | null} */
    this.femaleCollisionRadius = null;
    /** @type {number | null} */
    this.femaleCollisionHeight = null;

    /** @type {{ objectId: number, itemId: number }} */
    this.underwear = { objectId: 0, itemId: 0 } // TODO papperdoll system?
    /** @type {{ left: { objectId: number, itemId: number }, right: { objectId: number, itemId: number } }} */
    this.ear = {
      left: { objectId: 0, itemId: 0 },
      right: { objectId: 0, itemId: 0 }
    }
    /** @type {{ objectId: number, itemId: number }} */
    this.neck = { objectId: 0, itemId: 0 }
    /** @type {{ left: { objectId: number, itemId: number }, right: { objectId: number, itemId: number } }} */
    this.finger = {
      left: { objectId: 0, itemId: 0 },
      right: { objectId: 0, itemId: 0 }
    }
    /** @type {{ objectId: number, itemId: number }} */
    this.head = { objectId: 0, itemId: 0 }
    /** @type {{ left: { objectId: number, itemId: number }, right: { objectId: number, itemId: number }, leftAndRight: { objectId: number, itemId: number } }} */
    this.hand = {
      left: { objectId: 0, itemId: 0 },
      right: { objectId: 0, itemId: 0 },
      leftAndRight: { objectId: 0, itemId: 0 }
    } // leftHand, rightHand, twoHand?
    /** @type {{ objectId: number, itemId: number }} */
    this.gloves = { objectId: 0, itemId: 0 }
    /** @type {{ objectId: number, itemId: number }} */
    this.chest = { objectId: 0, itemId: 0 }
    /** @type {{ objectId: number, itemId: number }} */
    this.legs = { objectId: 0, itemId: 0 }
    /** @type {{ objectId: number, itemId: number }} */
    this.feet = { objectId: 0, itemId: 0 }
    /** @type {{ objectId: number, itemId: number }} */
    this.back = { objectId: 0, itemId: 0 }

    //
    /** @type {Character | null} */
    this.target = null; // target and aggroTarget?
    /** @type {number | null} */
    this.createdAt = null;
    /** @type {Map<number, { character: Character, damage: number }>} */
    this._hitHistoryMap = new Map();
    /** @type {number} */
    this._moveType = 0;
    //
    /** @type {{ targetX: number | null, targetY: number | null, targetZ: number | null, targetCharacterId: number | null, targetItemId: number | null, targetSkillId: number | null }} */
    this.actionParams = {
      targetX: null,
      targetY: null,
      targetZ: null,
      targetCharacterId: null,
      targetItemId: null,
      targetSkillId: null,
    }

    this.on('attacked', /** @param {{ attacker: Character, damage: number }} data */ (data) => {
      if (this.isDead) {
        return
      }

      this.takeDamage(data.damage);
      this.recordHit(data.attacker, data.damage);
      eventBusNew.emit('npc:attacked', { npc: this, attacker: data.attacker, damage: data.damage });
    });
  }

  get targetX() {
    return this.actionParams.targetX;
  }

  /** @param {number | null} value */
  set targetX(value) {
    this.actionParams.targetX = value;
  }

  get targetY() {
    return this.actionParams.targetY;
  }

  /** @param {number | null} value */
  set targetY(value) {
    this.actionParams.targetY = value;
  }

  get targetZ() {
    return this.actionParams.targetZ;
  }

  /** @param {number | null} value */
  set targetZ(value) {
    this.actionParams.targetZ = value;
  }

  get targetCharacterId() {
    return this.actionParams.targetCharacterId;
  }

  /** @param {number | null} value */
  set targetCharacterId(value) {
    this.actionParams.targetCharacterId = value;
  }

  get targetItemId() {
    return this.actionParams.targetItemId;
  }

  /** @param {number | null} value */
  set targetItemId(value) {
    this.actionParams.targetItemId = value;
  }

  get targetSkillId() {
    return this.actionParams.targetSkillId;
  }

  /** @param {number | null} value */
  set targetSkillId(value) {
    this.actionParams.targetSkillId = value;
  }

  /** @param {number} damage */
  takeDamage(damage) {
    this.hp = this.hp - damage;

    this.emit('damaged');
  }

  /**
   * @param {Character} character
   * @param {number} damage
   */
  recordHit(character, damage) {
    if (!character || !character.objectId) {
      return;
    }

    const hit = this._hitHistoryMap.get(character.objectId);

    if (hit) {
      hit.damage += damage;
    } else {
      this._hitHistoryMap.set(character.objectId, {
        character,
        damage
      });
    }
  }

  getHitHistory() {
    return this._hitHistoryMap;
  }

  getMoveType() {
    return this._moveType;
  }

  /** @param {number} moveType */
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

  /** @param {Record<string, unknown>} template */
  static create(template) {
    const character = new Character();

    for(const key in template) {
      if (character.hasOwnProperty(key)) {
        Reflect.set(character, key, template[key]);
      }
    }

    return character;
  }
}

module.exports = Character;