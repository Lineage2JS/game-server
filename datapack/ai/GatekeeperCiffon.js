const InstantTeleporter = require('./InstantTeleporter');

class GatekeeperCiffon extends InstantTeleporter {
  /**
   * @param {import('./DefaultNpc').Talker} talker
   */
  onTeleportRequested(talker) {
    // this.instantTeleport(talker, 48765, 248461, -6190);
  }
}

module.exports = GatekeeperCiffon;