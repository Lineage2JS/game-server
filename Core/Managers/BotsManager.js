const EventEmitter = require('events');
const database = require('./../../database');
const Bot = require('./../Models/Bot');

class BotsManager extends EventEmitter {
  constructor() {
    super();

    this._bots = [];
  }

  async enable() {
    for(let i = 0; i < 1; i++) {
      const bot = new Bot({
        sendPacket() {}
      });

      const gender = Math.floor(Math.random() * 2)
      const hairStyle = Math.floor(Math.random() * (gender === 0 ? 4 : 6));
      
      const positions = this._getRandomPos([{ x: -84999, y: 243217 }, { x: -84652, y: 242917 }, { x: -84382, y: 243289 }, { x: -84883, y: 243651 }]);
  
      bot.update({
        objectId: await database.getNextObjectId(),
        login: "a",
        characterName: "test" + i,
        title: "bot",
        level: 1,
        gender: gender,
        hairStyle: hairStyle, // 4
        hairColor: Math.floor(Math.random() * 2), // 2
        face: Math.floor(Math.random() * 2), // 2
        heading: 0,
        accessLevel: 0,
        onlineTime: 0,
        clanId: 0,
        clanLeader: 0,
        clanCrestId: 0,
        allianceId: 0,
        allianceCrestId: 0,
        gm: 0,
        privateStoreType: 0,
        exp: 0,
        sp: 0,
        pvp: 0,
        pk: 0,
        karma: 0,
        classId: 0,
        className: "Human Fighter",
        raceId: 0,
        str: 40,
        dex: 30,
        con: 43,
        int: 21,
        wit: 11,
        men: 25,
        hp: 126,
        maximumHp: 126,
        mp: 38,
        maximumMp: 38,
        pAtk: 4,
        pDef: 72,
        mAtk: 3,
        mDef: 47,
        pSpd: 330,
        mSpd: 213,
        accuracy: 33,
        critical: 44,
        evasion: 33,
        baseRunSpeed: 115,
        baseWalkSpeed: 80,
        swimSpeed: null,
        maximumLoad: 81900,
        x: positions[0],
        y: positions[1],
        z: -3720,
        canCraft: 0,
        maleAttackSpeedMultiplier: 1.188,
        maleCollisionRadius: 9,
        maleCollisionHeight: 23,
        femaleAttackSpeedMultiplier: 1.188,
        femaleCollisionRadius: "8",
        femaleCollisionHeight: "23.5",
      });

      const chestsId = [22, 23, 24]

      bot.chest = { objectId: 0, itemId: chestsId[Math.floor(Math.random() * chestsId.length)] }

      //
      //bot.heading = Math.floor(Math.random() * 30000);

      bot.ai.script = 'RunningBot';
      bot.waitType = 0;
      //
  
      bot.on('move', () => {
        this.emit('move', bot);
      });
  
      bot.on('attack', () => {
        this.emit('attack', bot);
      });
  
      bot.on('pickup', (item) => {
        this.emit('pickup', bot, item);
      });
  
      bot.enable();
  
      this._bots.push(bot);
  
      this.emit('spawn', bot);
    }
  }

  _getRandomPos(coordinates) {
    let xp = coordinates.map(i => i.x);
    let yp = coordinates.map(i => i.y);
		let max = { x: Math.max(...xp), y: Math.max(...yp) };
		let min = { x: Math.min(...xp), y: Math.min(...yp) };
		let x;
		let y;
		
		do {
			x = Math.floor(min.x + Math.random() * (max.x + 1 - min.x));
			y = Math.floor(min.y + Math.random() * (max.y + 1 - min.y));
		} while(!this._inPoly(xp, yp, x, y))

		return [x, y]
	}

  _inPoly(xp, yp, x, y){
		let npol = xp.length;
		let j = npol - 1;
		let c = false;

		for (let i = 0; i < npol; i++){
			if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
				(x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
				c = !c
			}
			j = i;
		}

		return c;
	}
}

module.exports = new BotsManager();