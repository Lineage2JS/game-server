const ServerPacket = require('./ServerPacket.js'); 

class UserInfo {
	constructor(player) {
    this._packet = new ServerPacket(600 + ServerPacket.strlen(player.name));
    this._packet.writeC(0x04)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeD(player.heading) 
      .writeD(player.objectId)
      .writeS(player.name)
      .writeD(player.raceId)
      .writeD(player.gender)
      .writeD(player.classId)
      .writeD(player.level)
      .writeD(player.exp)
      .writeD(player.str)
      .writeD(player.dex)
      .writeD(player.con)
      .writeD(player.int)
      .writeD(player.wit)
      .writeD(player.men)
      .writeD(player.maximumHp)
      .writeD(player.hp)
      .writeD(player.maximumMp)
      .writeD(player.mp)
      .writeD(player.sp)
      .writeD(100)
      .writeD(1000)
      
      .writeD(0x28)
      
      .writeD(player.underwear.objectId)
      .writeD(player.ear.right.objectId)
      .writeD(player.ear.left.objectId)
      .writeD(player.neck.objectId)
      .writeD(player.finger.right.objectId)
      .writeD(player.finger.left.objectId)

      .writeD(player.head.objectId)
      .writeD(player.hand.right.objectId)
      .writeD(player.hand.left.objectId)
      .writeD(player.gloves.objectId)
      .writeD(player.chest.objectId)
      .writeD(player.legs.objectId)
      .writeD(player.feet.objectId)
      .writeD(player.back.objectId)
      .writeD(player.hand.leftAndRight.objectId)

      .writeD(player.underwear.itemId)
      .writeD(player.ear.right.itemId)
      .writeD(player.ear.left.itemId)
      .writeD(player.neck.itemId)
      .writeD(player.finger.right.itemId)
      .writeD(player.finger.left.itemId)

      .writeD(player.head.itemId)
      .writeD(player.hand.right.itemId)
      .writeD(player.hand.left.itemId)
      .writeD(player.gloves.itemId)
      .writeD(player.chest.itemId)
      .writeD(player.legs.itemId)
      .writeD(player.feet.itemId)
      .writeD(player.back.itemId)
      .writeD(player.hand.leftAndRight.itemId)

      .writeD(player.pAtk)
      .writeD(player.pSpd)
      .writeD(player.pDef)
      .writeD(player.evasion)
      .writeD(player.accuracy)
      .writeD(player.critical)

      .writeD(player.mAtk)
      .writeD(player.mSpd)
      .writeD(player.pSpd)
      .writeD(player.mDef)

      .writeD(0)
      .writeD(player.karma)

      .writeD(player.runSpeed)
      .writeD(player.walkSpeed)
      .writeD(player.swimSpeed)
      .writeD(player.swimSpeed)
      .writeD(player.runSpeed) // getFloatingRunSpeed
      .writeD(player.walkSpeed) // getFloatingWalkSpeed
      .writeD(player.runSpeed) // getFlyingRunSpeed
      .writeD(player.walkSpeed); // getFlyingWalkSpeed

      // male
    if(player.gender === 0) {
      this._packet.writeF(1.1)
        .writeF(1.188)
        .writeF(9)
        .writeF(23);
    }

    // female
    if(player.gender === 1) {
      this._packet.writeF(0)
        .writeF(0)
        .writeF(0)
        .writeF(0);
    }

    this._packet.writeD(player.hairStyle)
      .writeD(player.hairColor)
      .writeD(player.face)
      .writeD(player.gm)
      .writeS(player.title)
      .writeD(player.clanId)
      .writeD(player.clanCrestId)
      .writeD(player.allianceId)
      .writeD(player.allianceCrestId)
      .writeD(0x00) // 0x60 ??? // siege-flags
      .writeC(0x00)
      .writeC(player.privateStoreType)
      .writeC(player.canCraft)
      .writeD(player.pk)
      .writeD(player.pvp)
      .writeH(0x00) // cubic count
      //		.writeH(0x01) // 1-yellow 2-orange 3-yellow star 4-violett 5-blue cube  
      //		.writeH(0x02) // 1-yellow 2-orange 3-yellollow star 4-violett 5-blue cube  w star  4-violett 5-blue cube  
      //		.writeH(0x03) // 1-yellow 2-orange 3-ye
      //		.writeH(0x04) // 1-yellow 2-orange 3-yellow star 4-violett 5-blue cube  
      //		.writeH(0x05) // 1-yellow 2-orange 3-yellow star 4-violett 5-blue cube  
      .writeC(0x00); // 1-find party members
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = UserInfo;