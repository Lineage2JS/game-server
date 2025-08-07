const ServerPacket = require('./ServerPacket.js'); 

class CharacterInfo {
  constructor(player) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x03)
    .writeD(player.x)
    .writeD(player.y)
    .writeD(player.z)
    .writeD(player.heading)
    .writeD(player.objectId)
    .writeS(player.characterName)
    .writeD(player.raceId)
    .writeD(player.gender)
    .writeD(player.classId)
    
    .writeD(0x00)

    .writeD(0)
    .writeD(0)
    .writeD(0)
    .writeD(0)
    .writeD(player.chest.itemId)
    .writeD(0)
    .writeD(0)
    .writeD(0)
    .writeD(0)
    .writeD(0)

    .writeD(0x00)
    .writeD(0)
    .writeD(0)
    
    .writeD(0)
    .writeD(player.karma)

    .writeD(player.baseRunSpeed)
    .writeD(player.baseWalkSpeed)
    .writeD(32)
    .writeD(32)
    .writeD(player.baseRunSpeed) // getFloatingRunSpeed
    .writeD(player.baseWalkSpeed) // getFloatingWalkSpeed
    .writeD(player.baseRunSpeed) // getFlyingRunSpeed
    .writeD(player.baseWalkSpeed) // getFlyingWalkSpeed

    // male
    if(player.gender === 0) {
      this._packet.writeF(player.maleAttackSpeedMultiplier)
        .writeF((player.pSpd / 500) / 0.555)
        .writeF(player.maleCollisionRadius)
        .writeF(player.maleCollisionHeight)
    }

    // female
    if(player.gender === 1) {
      this._packet.writeF(player.femaleAttackSpeedMultiplier)
        .writeF((player.pSpd / 500) / 0.555)
        .writeF(player.femaleCollisionRadius)
        .writeF(player.femaleCollisionHeight)
    }

    this._packet.writeD(player.hairStyle)
      .writeD(player.hairColor)
      .writeD(player.face)

      .writeS(player.title)
      .writeD(player.clanId) // pledge id
      .writeD(player.clanCrestId) // pledge crest id
      .writeD(0x10)

      .writeD(0x00)	// getAllyId new in rev 417
      .writeD(0x00)	// new in rev 417   siege-flags

      .writeC(player.waitType)
      .writeC(1)

      .writeC(0)
      .writeC(0x00) // isDead dead = 1  alive = 0

      .writeC(0x00)	// invisible = 1  visible =0
      .writeC(0x00)	// 1 on strider   2 on wyfern   0 no mount
      .writeC(0)   // 1 - sellshop
      
      .writeH(0x00)  // cubic count
  	  //.writeH(0x00);  // cubic 
      .writeC(0x00);	// find party members
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CharacterInfo;