const SendProtocolVersion = require('./SendProtocolVersion');
const RequestAuthLogin = require('./RequestAuthLogin');
const CharacterSelected = require('./CharacterSelected');
const RequestQuestList = require('./RequestQuestList');
const EnterWorld = require('./EnterWorld');
const NewCharacter = require('./NewCharacter');
const CharacterCreate = require('./CharacterCreate');
const CharacterDelete = require('./CharacterDelete');
const MoveBackwardToLocation = require('./MoveBackwardToLocation');
const Action = require('./Action');
const RequestAttack = require('./RequestAttack');
const Logout = require('./Logout');
const RequestRestart = require('./RequestRestart');
const RequestTargetCancel = require('./RequestTargetCancel');
const RequestItemList = require('./RequestItemList');
const RequestShortCutReg = require('./RequestShortCutReg');
const RequestBypassToServer = require('./RequestBypassToServer');
const RequestSkillList = require('./RequestSkillList');
const RequestMagicSkillUse = require('./RequestMagicSkillUse');
const RequestShowBoard = require('./RequestShowBoard');
const RequestSocialAction = require('./RequestSocialAction');
const ValidatePosition = require('./ValidatePosition');
const RequestActionUse = require('./RequestActionUse');
const Say2 = require('./Say2');
const SendBypassBuildCmd = require('./SendBypassBuildCmd');
const RequestLinkHtml = require('./RequestLinkHtml');
const RequestUseItem = require('./RequestUseItem');
const RequestUnEquipItem = require('./RequestUnEquipItem');
const CanNotMoveAnymore = require('./CanNotMoveAnymore');
const RequestBuyItem = require('./RequestBuyItem');
const RequestRestartPoint = require('./RequestRestartPoint');
const RequestAcquireSkillInfo = require('./RequestAcquireSkillInfo');
const RequestAcquireSkill = require('./RequestAcquireSkill');
const RequestDropItem = require('./RequestDropItem');
const RequestDestroyItem = require('./RequestDestroyItem');

module.exports = {
  SendProtocolVersion,
  RequestAuthLogin,
  CharacterSelected,
  RequestQuestList,
  EnterWorld,
  NewCharacter,
  CharacterCreate,
  CharacterDelete,
  MoveBackwardToLocation,
  Action,
  RequestAttack,
  Logout,
  RequestRestart,
  RequestTargetCancel,
  RequestItemList,
  RequestShortCutReg,
  RequestBypassToServer,
  RequestSkillList,
  RequestMagicSkillUse,
  RequestShowBoard,
  RequestSocialAction,
  ValidatePosition,
  RequestActionUse,
  Say2,
  SendBypassBuildCmd,
  RequestLinkHtml,
  RequestUseItem,
  RequestUnEquipItem,
  CanNotMoveAnymore,
  RequestBuyItem,
  RequestRestartPoint,
  RequestAcquireSkillInfo,
  RequestAcquireSkill,
  RequestDropItem,
  RequestDestroyItem,
}