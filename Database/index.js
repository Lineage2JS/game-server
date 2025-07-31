const { Client } = require('pg');

class Database {
  constructor() {
    this._client = null;
  }

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
      throw new Error(`database connected: failed (${e.message})`);
    }
  }

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
      new Date(character.createdAt),
    ]);
    const characterData = result.rows[0];

    return characterData;
  }

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

  async deleteCharacter(objectId) {
    await this._client.query(`
      DELETE FROM characters
      WHERE object_id = $1
    `, [objectId]);
  }

  async getNextObjectId() {
    const result = await this._client.query(`
      SELECT *
      FROM object_id_registry
      WHERE registry_id = 0
    `);

    const objectId = result.rows[0].last_object_id;

    await this._client.query(`
      UPDATE object_id_registry
      SET last_object_id = $1
      WHERE registry_id = $2
    `, [objectId + 1, 0]);

    return objectId;
  }

  async addGameServer(params) {
    await this._client.query(`
      INSERT INTO gameservers (id, host, port, age_limit, is_pvp, max_players, server_status, server_type)
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

  async checkGameServerExistsById(gameServerId) {
    const result = await this._client.query(`
      SELECT EXISTS(
        SELECT 1 
        FROM gameservers 
        WHERE id = $1
      )
    `, [gameServerId]);
    const isGameServerExisting = result.rows[0].exists;

    return isGameServerExisting;
  }

  async updateGameServer(id, field, value) {
    await this._client.query(`
      UPDATE gameservers
      SET server_status = $1
      WHERE id = $2
    `, [value, id]);
  }

  async createInventory(inventoryItems) {
    await this._client.query('BEGIN');

    for (let i = 0; i < inventoryItems.length; i++) {
      const inventoryItem = inventoryItems[i];

      await this._client.query(`
        INSERT INTO inventories(item_object_id, item_id, item_type, item_name, item_count, equip_slot, is_equipped, consume_type, character_object_id)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        inventoryItem.itemObjectId,
        inventoryItem.itemId,
        inventoryItem.itemType,
        inventoryItem.itemName,
        inventoryItem.itemCount,
        inventoryItem.itemEquipSlot,
        inventoryItem.isEquipped,
        inventoryItem.consumeType,
        inventoryItem.characterObjectId
      ]);
    }

    await this._client.query('COMMIT');
  }

  async getCharacterInventoryItems(objectId) {
    const result = await this._client.query(`
      SELECT
        item_object_id AS "objectId",
        item_id AS "itemId",
        consume_type AS "consumeType",
        item_type AS "itemType",
        item_name AS "itemName",
        equip_slot AS "equipSlot"
      FROM inventories
      WHERE character_object_id = $1
    `, [objectId]);
    const inventoryItems = result.rows;

    return inventoryItems;
  }

  async deleteCharacterInventory(objectId) {
    await this._client.query(`
      DELETE FROM inventories
      WHERE character_object_id = $1
    `, [objectId]);
  }

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

  async updateScheduledTask(task) {
    await this._client.query(`
      UPDATE scheduled_tasks
      SET
        status = $2
      WHERE id = $1
    `, [task.id, task.status]);
  }

  async deleteScheduledTask(type, payload) {
    await this._client.query(`
      DELETE FROM scheduled_tasks
      WHERE type = $1
      AND payload::jsonb @> $2::jsonb;
    `, [type, payload]);
  }
}

module.exports = new Database();