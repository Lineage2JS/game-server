const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const playersManager = require('./../Managers/PlayersManager');

class RequestTargetCanceled {
	constructor(client, packet) {
		this._client = client;
    this._data = new ClientPacket(packet);

		this._init();
	}

	_init() {
    const player = playersManager.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.TargetUnselected(player));

		player.target = null;
	}
}

module.exports = RequestTargetCanceled;