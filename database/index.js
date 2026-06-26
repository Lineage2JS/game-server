const { Client } = require('pg');

class Database {
  constructor() {
    /** @type {Client} */
    this._client = /** @type {any} */(null);
  }

  /**
   * @param {string} username
   * @param {string} password
   * @param {string} host
   * @param {number} port
   * @param {string} dbname
   * @param {Function} callback
   */
  async connect(username, password, host, port,  dbname, callback) {
    this._client = new Client({
      user: username,
      password,
      host,
      port,
      database: dbname,
    });

    try {
      await this._client.connect();

      callback()
    } catch(e) {
      const error = /** @type {Error} */(e);
      throw new Error(`database connected: failed (${error.message})`);
    }
  }

  /**
    * @param {import('../core/Models/Character')} character
    * @returns {Promise<{ object_id: number, user_login: string, character_name: string, title: string, level: number}>}
   */
  async createCharacter(character) {
    const result = await this._client.query(`
      INSERT INTO characters (object_id, user_login, character_name, title, level, gender, hair_style, hair_color, face, heading, access_level, online, online_time, is_gm, exp, sp, pvp, pk, karma, class_id, class_name, race_id, str, dex, con, int, wit, men, current_hp, max_hp, current_mp, max_mp, base_run_speed, base_walk_speed, x, y, z, attack_speed_multiplier, collision_radius, collision_height, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41)
      RETURNING *
    `, [
      character.objectId,
      character.login,
      character.characterName,
      character.title,
      character.level,
      character.gender,
      character.hairStyle,
      character.hairColor,
      character.face,
      character.heading,
      character.accessLevel,
      character.online,
      character.onlineTime,
      character.gm,
      character.exp,
      character.sp,
      character.pvp,
      character.pk,
      character.karma,
      character.classId,
      character.className,
      character.raceId,
      character.str,
      character.dex,
      character.con,
      character.int,
      character.wit,
      character.men,
      character.hp,
      character.maximumHp,
      character.mp,
      character.maximumMp,
      character.baseRunSpeed,
      character.baseWalkSpeed,
      character.x,
      character.y,
      character.z,
      character.maleAttackSpeedMultiplier,
      character.maleCollisionRadius,
      character.maleCollisionHeight,
      new Date(/** @type {number} */(character.createdAt)),
    ]);
    const characterData = result.rows[0];

    return characterData;
  }

  /**
   * @param {number} objectId
   * @param {import('../core/Models/Character')} character
   */
  async updateCharacter(objectId, character) {
    await this._client.query(`
      UPDATE characters
      SET
        x = $2,
        y = $3,
        z = $4
      WHERE object_id = $1
    `, [objectId, character.x, character.y, character.z]);
  }

  /**
   * @param {string | null} userLogin
   * @returns {Promise<import('../core/Models/Character')[]>}
   */
  async getCharactersByLogin(userLogin) { // fix delete
    const result = await this._client.query(`
      SELECT
      object_id AS "objectId",
      user_login AS "login",
      character_name AS "characterName",
      title,
      level,
      gender,
      hair_style AS "hairStyle",
      hair_color AS "hairColor",
      face,
      heading,
      access_level AS "accessLevel",
      online,
      online_time AS "onlineTime",
      is_gm AS gm,
      exp,
      sp,
      pvp,
      pk,
      karma,
      class_id AS "classId",
      class_name AS "className",
      race_id AS "raceId",
      str,
      dex,
      con,
      int,
      wit,
      men,
      current_hp AS hp,
      max_hp AS "maximumHp",
      current_mp AS mp,
      max_mp AS "maximumMp",
      base_run_speed AS "baseRunSpeed",
      base_walk_speed AS "baseWalkSpeed",
      x,
      y,
      z,
      attack_speed_multiplier AS "maleAttackSpeedMultiplier",
      collision_radius AS "maleCollisionRadius",
      collision_height AS "maleCollisionHeight",
      scheduled_task.scheduled_at AS "scheduledDeletionAt",
      created_at AS "createdAt"
      FROM characters
      LEFT JOIN scheduled_tasks scheduled_task ON
        scheduled_task.created_type = 'user'
        AND scheduled_task.type = 'character-deletion'
        AND scheduled_task.created_account_id = $1
        AND (scheduled_task.payload::json->>'characterObjectId')::INTEGER = object_id
      WHERE user_login = $1
      ORDER BY created_at ASC
    `, [userLogin]); // fix male
    const characters = result.rows;

    return characters;
  }

  /**
   * @param {number} objectId
   * @returns {Promise<import('../core/Models/Character') | null>}
   */
  async getCharacter(objectId) {
    const result = await this._client.query(`
      SELECT
      object_id AS "objectId",
      user_login AS "login",
      character_name AS "characterName",
      title,
      level,
      gender,
      hair_style AS "hairStyle",
      hair_color AS "hairColor",
      face,
      heading,
      access_level AS "accessLevel",
      online,
      online_time AS "onlineTime",
      is_gm AS gm,
      exp,
      sp,
      pvp,
      pk,
      karma,
      class_id AS "classId",
      class_name AS "className",
      race_id AS "raceId",
      str,
      dex,
      con,
      int,
      wit,
      men,
      current_hp AS hp,
      max_hp AS "maximumHp",
      current_mp AS mp,
      max_mp AS "maximumMp",
      base_run_speed AS "baseRunSpeed",
      base_walk_speed AS "baseWalkSpeed",
      x,
      y,
      z,
      attack_speed_multiplier AS "maleAttackSpeedMultiplier",
      collision_radius AS "maleCollisionRadius",
      collision_height AS "maleCollisionHeight"
      FROM characters
      WHERE object_id = $1
    `, [objectId]); // fix male
    const character = result.rows[0];

    return character;
  }

  /**
   * @param {string} characterName
   * @returns {Promise<boolean>}
   */
  async isCharacterNameTaken(characterName) {
    const result = await this._client.query(`
      SELECT EXISTS(
        SELECT 1
        FROM characters
        WHERE character_name = $1
        LIMIT 1
      )
    `, [characterName]);
    const isNameTaken = result.rows[0].exists;

    return isNameTaken;
  }

  /**
   * @param {number} objectId
   * @returns {Promise<void>}
   */
  async deleteCharacter(objectId) {
    await this._client.query(`
      DELETE FROM characters
      WHERE object_id = $1
    `, [objectId]);
  }

  /**
   * @returns {Promise<number>}
   */
  async getNextObjectId() {
    const result = await this._client.query(`
      SELECT *
      FROM object_id_registry
      WHERE registry_id = 1
    `);

    const objectId = result.rows[0].last_object_id;

    await this._client.query(`
      UPDATE object_id_registry
      SET last_object_id = $1
      WHERE registry_id = $2
    `, [objectId + 1, 1]);

    return objectId;
  }

  /**
   * @param {{ id: number, host: string, port: number, ageLimit: number, isPvP: boolean, maxPlayers: number, status: string, type: string }} params 
   */
  async addGameServer(params) {
    await this._client.query(`
      INSERT INTO gameservers (gameserver_id, host, port, age_limit, is_pvp, max_players, server_status, server_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      params.id,
      params.host,
      params.port,
      params.ageLimit,
      params.isPvP,
      params.maxPlayers,
      params.status,
      params.type
    ]);
  }

  /**
   * @param {number} gameServerId
   * @returns {Promise<unknown | null>}
   */
  async getGameServerById(gameServerId) {
    const result = await this._client.query(`
      SELECT *
      FROM gameservers
      WHERE id = $1
    `, [gameServerId]);
    const gameserver = result.rows[0];

    if (gameserver) {
      return gameserver;
    } else {
      return null;
    }
  }

  /**
   * 
   * @param {number} gameServerId 
   * @returns {Promise<boolean>}
   */
  async checkGameServerExists(gameServerId) {
    const result = await this._client.query(`
      SELECT EXISTS(
        SELECT 1
        FROM gameservers
        WHERE gameserver_id = $1
      )
    `, [gameServerId]);
    const isGameServerExisting = result.rows[0].exists;

    return isGameServerExisting;
  }

  /**
   * @param {number} id
   * @param {string} field
   * @param {*} value
   * @returns {Promise<void>}
   */
  async updateGameServer(id, field, value) {
    await this._client.query(`
      UPDATE gameservers
      SET server_status = $1
      WHERE id = $2
    `, [value, id]);
  }

  /**
   * @param {{ objectId: number, itemId: number, itemCount: number, location: string, ownerObjectId: number, equipSlot: number }} item
   */
  async createItem(item) {
    await this._client.query(`
      INSERT INTO items(object_id, item_id, item_count, location, owner_object_id, equip_slot)
      VALUES($1, $2, $3, $4, $5, $6)
    `, [
      item.objectId, // TODO getObjectId()?
      item.itemId,
      item.itemCount,
      item.location,
      item.ownerObjectId,
      item.equipSlot,
    ]);
  }

  /**
   * @param {number} objectId
   * @returns {Promise<{ objectId: number, itemId: number, itemCount: number, equipSlot: string }[]>}
   */
  async getCharacterInventoryItems(objectId) {
    const result = await this._client.query(`
      SELECT
        object_id AS "objectId",
        item_id AS "itemId",
        item_count AS "itemCount",
        equip_slot AS "equipSlot"
      FROM items
      WHERE owner_object_id = $1
      AND location = 'inventory'
    `, [objectId]);
    const inventoryItems = result.rows;

    return inventoryItems;
  }

  /**
   * @param {number} objectId
   * @returns {Promise<void>}
   */
  async deleteCharacterItems(objectId) {
    await this._client.query(`
      DELETE FROM items
      WHERE owner_object_id = $1
    `, [objectId]);
  }

  /**
   * @param {*} taskType
   * @param {*} taskStatus
   * @param {*} payload
   * @param {*} scheduledAt
   * @param {*} createdAccountId
   * @param {*} createdType
   */
  async createScheduledTask(taskType, taskStatus, payload, scheduledAt, createdAccountId, createdType) {
    await this._client.query(`
      INSERT INTO scheduled_tasks(type, status, payload, scheduled_at, created_account_id, created_type)
      VALUES($1, $2, $3, $4, $5, $6)
    `, [
      taskType,
      taskStatus,
      payload,
      new Date(scheduledAt),
      createdAccountId,
      createdType,
    ]);
  }

  /**
   * @returns {Promise<{  id: number, type: string, payload: string, scheduledAt: number, status: string, createdAccountId: string, createdType: string }[]>}
   */
  async getScheduledTasks() {
    const result = await this._client.query(`
      SELECT
        id,
        type,
        payload,
        scheduled_at AS "scheduledAt",
        status,
        created_account_id AS "createdAccountId",
        created_type AS "createdType"
      FROM scheduled_tasks
      WHERE status = 'new'
    `);
    const scheduledTasks = result.rows;

    return scheduledTasks;
  }

  /**
   * @param {{ id: number, status: string }} task
   * @returns {Promise<void>}
   */
  async updateScheduledTask(task) {
    await this._client.query(`
      UPDATE scheduled_tasks
      SET
        status = $2
      WHERE id = $1
    `, [task.id, task.status]);
  }

  /**
   * @param {string} type
   * @param {string} payload
   * @returns {Promise<void>}
   */
  async deleteScheduledTask(type, payload) {
    await this._client.query(`
      DELETE FROM scheduled_tasks
      WHERE type = $1
      AND payload::jsonb @> $2::jsonb;
    `, [type, payload]);
  }

  /**
   * @param {{ id: number; level: number }} skill
   * @param {number} characterObjectId
   */
  async createSkill(skill, characterObjectId) {
    await this._client.query(`
      INSERT INTO skills(skill_id, skill_level, owner_object_id)
      VALUES($1, $2, $3)
    `, [
      skill.id,
      skill.level,
      characterObjectId
    ]);
  }

  /**
   * @param {number} characterObjectId
   * @returns {Promise<{ skillId: number, skillLevel: number }[]>}
   */
  async getCharacterSkills(characterObjectId) {
    const result = await this._client.query(`
      SELECT
        skill_id AS "skillId",
        skill_level AS "skillLevel"
      FROM skills
      WHERE owner_object_id = $1
    `, [characterObjectId]);
    const skills = result.rows;

    return skills;
  }

  /**
   * @param {number} objectId
   * @returns {Promise<void>}
   */
  async deleteCharacterSkills(objectId) {
    await this._client.query(`
      DELETE FROM skills
      WHERE owner_object_id = $1
    `, [objectId]);
  }
}

module.exports = new Database();