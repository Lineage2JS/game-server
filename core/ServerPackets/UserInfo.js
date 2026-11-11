const ServerPacket = require('./ServerPacket'); 

class UserInfo {
  constructor(player) {
    this._packet = new ServerPacket();
    this._packet
      .writeC(0x04)
      .writeD(player.x)
      .writeD(player.y)
      .writeD(player.z)
      .writeD(player.getHeading()) 
      .writeD(player.objectId)
      .writeS(player.getCharacterName())
      .writeD(player.raceId)
      .writeD(player.getAppearanceStats().getGender())
      .writeD(player.classId)
      .writeD(player.level)
      .writeD(player.getProgressStats().getExp())
      .writeD(player.getBaseStats().getStr())
      .writeD(player.getBaseStats().getDex())
      .writeD(player.getBaseStats().getCon())
      .writeD(player.getBaseStats().getInt())
      .writeD(player.getBaseStats().getWit())
      .writeD(player.getBaseStats().getMen())
      .writeD(player.maxHp)
      .writeD(player.hp)
      .writeD(player.maxMp)
      .writeD(player.mp)
      .writeD(player.getProgressStats().getSp())
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

      .writeD(player.getCombatStats().getPAtk())
      .writeD(player.getCombatStats().getPSpd())
      .writeD(player.getCombatStats().getPDef())
      .writeD(player.getCombatStats().getEvasion())
      .writeD(player.getCombatStats().getAccuracy())
      .writeD(player.getCombatStats().getCritical())

      .writeD(player.getCombatStats().getMAtk())
      .writeD(player.getCombatStats().getMSpd())
      .writeD(player.getCombatStats().getPSpd()) // TODO дубль?
      .writeD(player.getCombatStats().getMDef())

      .writeD(0)
      .writeD(player.getSocialStats().getKarma())

      .writeD(player.baseRunSpeed)
      .writeD(player.baseWalkSpeed)
      .writeD(player.swimSpeed)
      .writeD(player.swimSpeed)
      .writeD(player.runSpeed) // getFloatingRunSpeed
      .writeD(player.walkSpeed) // getFloatingWalkSpeed
      .writeD(player.runSpeed) // getFlyingRunSpeed
      .writeD(player.walkSpeed) // getFlyingWalkSpeed
      .writeF(player.movementMultiplier)
      .writeF(player.attackSpeedMultiplier);
      
      // male
    if(player.getAppearanceStats().getGender() === 0) {
      this._packet
        .writeF(player.getCollisionStats().getMaleCollisionRadius())
        .writeF(player.getCollisionStats().getMaleCollisionHeight());
    }

    // female
    if(player.getAppearanceStats().getGender() === 1) {
      this._packet
        .writeF(player.getCollisionStats().getFemaleCollisionRadius())
        .writeF(player.getCollisionStats().getFemaleCollisionHeight());
    }

    this._packet
      .writeD(player.getAppearanceStats().getHairStyle())
      .writeD(player.getAppearanceStats().getHairColor())
      .writeD(player.getAppearanceStats().getFace())
      .writeD(0) // isGM
      .writeS(player.title)
      .writeD(player.clanId)
      .writeD(player.clanCrestId)
      .writeD(player.allianceId)
      .writeD(player.allianceCrestId)
      .writeD(0x00) // 0x60 ??? // siege-flags
      .writeC(0x00)
      .writeC(player.privateStoreType)
      .writeC(player.canCraft)
      .writeD(player.getSocialStats().getPk())
      .writeD(player.getSocialStats().getPvp())
      .writeH(0x00) // cubic count
      //.writeH(0x01) // 1-yellow 2-orange 3-yellow star 4-violett 5-blue cube  
      //.writeH(0x02) // 1-yellow 2-orange 3-yellollow star 4-violett 5-blue cube  w star  4-violett 5-blue cube  
      //.writeH(0x03) // 1-yellow 2-orange 3-ye
      //.writeH(0x04) // 1-yellow 2-orange 3-yellow star 4-violett 5-blue cube  
      //.writeH(0x05) // 1-yellow 2-orange 3-yellow star 4-violett 5-blue cube  
      .writeC(0x00); // 1-find party members
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = UserInfo;