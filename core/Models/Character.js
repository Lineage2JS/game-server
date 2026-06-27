const baseStats = require('./../../datapack/baseStats.json');
const eventBusNew = require('./../Events/EventBusNew');
const EventEmitter = require('events');

/** @typedef {{ objectId: number, login: string, characterName: string, title?: string, level?: number, gender: number, hairStyle: number, hairColor: number, face: number, createdAt: number, classId: number, className: string, raceId: number, str: number, dex: number, con: number, int: number, wit: number, men: number, hp: number, mp: number, pAtk: number, pDef: number, mAtk: number, mDef: number, pSpd: number, mSpd: number, accuracy: number, critical: number, evasion: number, baseRunSpeed: number, baseWalkSpeed: number, baseAttackSpeed?: number, swimSpeed?: number, maximumLoad: number, x: number, y: number, z: number, canCraft: number, maleAttackSpeedMultiplier: number, maleCollisionRadius: number, maleCollisionHeight: number, femaleAttackSpeedMultiplier: number, femaleCollisionRadius: number, femaleCollisionHeight: number, items: number[] }} CharacterTemplate */

class Character extends EventEmitter {
  /** @param {CharacterTemplate} template */
  static create(template) {
    return new Character(template);
  }

  /** @param {CharacterTemplate} template */
  constructor(template) {
    super();

    /** @type {number} */
    this.objectId = template.objectId; // getObjectId()
    /** @type {string} */
    this.login = template.login || '';
    /** @type {string} */
    this.characterName = template.characterName || '';
    /** @type {string} */
    this.title = template.title || '';
    /** @type {number} */
    this.level = template.level || 1;
    /** @type {number} */
    this.gender = template.gender || 0;
    /** @type {number} */
    this.hairStyle = template.hairStyle || 0;
    /** @type {number} */
    this.hairColor = template.hairColor || 0;
    /** @type {number} */
    this.face = template.face || 0;
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

    /** @type {number} */
    this.classId = template.classId;
    /** @type {string} */
    this.className = template.className;
    /** @type {number} */
    this.raceId = template.raceId;

    /** @type {number} */
    this.str = template.str || 0;
    /** @type {number} */
    this.dex = template.dex || 0;
    /** @type {number} */
    this.con = template.con || 0;
    /** @type {number} */
    this.int = template.int || 0;
    /** @type {number} */
    this.wit = template.wit || 0;
    /** @type {number} */
    this.men = template.men || 0;
    /** @type {number} */
    this.hp = template.hp || 0;
    /** @type {number} */
    this.maximumHp = template.hp || 0;
    /** @type {number} */
    this.mp = template.mp || 0;
    /** @type {number} */
    this.maximumMp = template.mp || 0;

    /** @type {number} */
    this.pAtk = template.pAtk || 0;
    /** @type {number} */
    this.pDef = template.pDef || 0;
    /** @type {number} */
    this.mAtk = template.mAtk || 0;
    /** @type {number} */
    this.mDef = template.mDef || 0;
    /** @type {number} */
    this.pSpd = template.pSpd || 0;
    /** @type {number} */
    this.mSpd = template.mSpd || 0;
    /** @type {number} */
    this.accuracy = template.accuracy || 0;
    /** @type {number} */
    this.critical = template.critical || 0;
    /** @type {number} */
    this.evasion = template.evasion || 0;
    /** @type {number} */
    this.baseRunSpeed = template.baseRunSpeed || 0;
    /** @type {number} */
    this.baseWalkSpeed = template.baseWalkSpeed || 0;
    /** @type {number} */
    this.baseAttackSpeed = template.baseAttackSpeed || 0;
    /** @type {number} */
    this.swimSpeed = template.swimSpeed || 0;
    /** @type {number} */
    this.maximumLoad = template.maximumLoad || 0;

    /** @type {number} */
    this.x = template.x || 0;
    /** @type {number} */
    this.y = template.y || 0;
    /** @type {number} */
    this.z = template.z || 0;

    /** @type {number} */
    this.canCraft = template.canCraft || 0;

    /** @type {number} */
    this.maleAttackSpeedMultiplier = template.maleAttackSpeedMultiplier || 0;
    /** @type {number} */
    this.maleCollisionRadius = template.maleCollisionRadius || 0;
    /** @type {number} */
    this.maleCollisionHeight = template.maleCollisionHeight || 0;

    /** @type {number} */
    this.femaleAttackSpeedMultiplier = template.femaleAttackSpeedMultiplier || 0;
    /** @type {number} */
    this.femaleCollisionRadius = template.femaleCollisionRadius || 0;
    /** @type {number} */
    this.femaleCollisionHeight = template.femaleCollisionHeight || 0;

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
    /** @type {number | null} */
    this.target = null; // target and aggroTarget?
    /** @type {number | null} */
    this.createdAt = null;
    /** @type {number | null} */
    this.scheduledDeletionAt = null;
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
}

module.exports = Character;