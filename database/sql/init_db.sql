-- ============================================================
-- gameservers
-- ============================================================
CREATE TABLE gameservers (
	id                SERIAL        PRIMARY KEY,
	gameserver_id     INTEGER       NOT NULL,
	host              VARCHAR       NOT NULL,
	port              INTEGER       NOT NULL,
	age_limit         INTEGER       NOT NULL,
	is_pvp            BOOLEAN       NOT NULL,
	max_players       INTEGER       NOT NULL,
	server_status     INTEGER       NOT NULL,
	server_type       INTEGER       NOT NULL
);

-- ============================================================
-- object_id_registry
-- ============================================================

CREATE TABLE object_id_registry (
	registry_id       SERIAL        PRIMARY KEY,
	last_object_id    INTEGER       NOT NULL
);

-- initialize first id
insert into object_id_registry (last_object_id, registry_id)
values (1,  1);

-- ============================================================
-- scheduled_tasks
-- ============================================================

CREATE TABLE scheduled_tasks (
	id                  SERIAL        PRIMARY KEY,
	type                VARCHAR       NOT NULL,
	payload             JSONB         NOT NULL,
	scheduled_at        TIMESTAMPTZ   NOT NULL,
	created_account_id  VARCHAR       NOT NULL,
	created_type        VARCHAR       NOT NULL,
	status              VARCHAR       DEFAULT 'new'
);

-- ============================================================
-- characters
-- ============================================================
CREATE TABLE characters (
  object_id                INTEGER       PRIMARY KEY,          -- object_id (из object_id_registry)
  user_login               VARCHAR(64)   NOT NULL,
  character_name           VARCHAR(64)   NOT NULL UNIQUE,      -- unique - isCharacterNameTaken exception
  title                    VARCHAR(64)   NOT NULL DEFAULT '',
  level                    SMALLINT      NOT NULL DEFAULT 1,
  gender                   SMALLINT      NOT NULL DEFAULT 0,
  hair_style               SMALLINT      NOT NULL DEFAULT 0,
  hair_color               SMALLINT      NOT NULL DEFAULT 0,
  face                     SMALLINT      NOT NULL DEFAULT 0,
  heading                  INTEGER       NOT NULL DEFAULT 0,
  access_level             INTEGER       NOT NULL DEFAULT 0,
  online                   BOOLEAN       NOT NULL DEFAULT FALSE,
  online_time              INTEGER        NOT NULL DEFAULT 0,   -- seconds
  is_gm                    BOOLEAN       NOT NULL DEFAULT FALSE, -- SELECT ... is_gm AS gm
  exp                      INTEGER        NOT NULL DEFAULT 0,
  sp                       INTEGER        NOT NULL DEFAULT 0,
  pvp                      INTEGER       NOT NULL DEFAULT 0,
  pk                       INTEGER       NOT NULL DEFAULT 0,
  karma                    INTEGER       NOT NULL DEFAULT 0,
  class_id                 INTEGER       NOT NULL,
  class_name               VARCHAR(64)   NOT NULL,
  race_id                  INTEGER       NOT NULL,
  str                      SMALLINT      NOT NULL DEFAULT 0,
  dex                      SMALLINT      NOT NULL DEFAULT 0,
  con                      SMALLINT      NOT NULL DEFAULT 0,
  int                      SMALLINT      NOT NULL DEFAULT 0,
  wit                      SMALLINT      NOT NULL DEFAULT 0,
  men                      SMALLINT      NOT NULL DEFAULT 0,
  current_hp               DOUBLE PRECISION NOT NULL DEFAULT 0,
  max_hp                   DOUBLE PRECISION NOT NULL DEFAULT 0,
  current_mp               DOUBLE PRECISION NOT NULL DEFAULT 0,
  max_mp                   DOUBLE PRECISION NOT NULL DEFAULT 0,
  base_run_speed           INTEGER       NOT NULL DEFAULT 0,
  base_walk_speed          INTEGER       NOT NULL DEFAULT 0,
  x                        INTEGER       NOT NULL DEFAULT 0,
  y                        INTEGER       NOT NULL DEFAULT 0,
  z                        INTEGER       NOT NULL DEFAULT 0,
  attack_speed_multiplier  DOUBLE PRECISION NOT NULL DEFAULT 1,
  collision_radius         DOUBLE PRECISION NOT NULL DEFAULT 0,
  collision_height         DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at               TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_characters_user_login ON characters (user_login);

-- ============================================================
-- items
-- ============================================================
CREATE TABLE items (
  object_id         INTEGER     PRIMARY KEY,                   -- item object_id
  item_id           INTEGER     NOT NULL,                      -- item type id
  item_count        INTEGER     NOT NULL DEFAULT 1,            -- quantity
  location          VARCHAR(32) NOT NULL,                      -- 'inventory', ...
  owner_object_id   INTEGER     NOT NULL
                                REFERENCES characters (object_id) ON DELETE CASCADE,
  equip_slot        INTEGER     NOT NULL DEFAULT 0
);

CREATE INDEX idx_items_owner_location ON items (owner_object_id, location);

-- ============================================================
-- skills
-- ============================================================
CREATE TABLE skills (
  skill_id          INTEGER     NOT NULL,
  skill_level       INTEGER     NOT NULL DEFAULT 1,
  owner_object_id   INTEGER     NOT NULL
                                REFERENCES characters (object_id) ON DELETE CASCADE,
  PRIMARY KEY (owner_object_id, skill_id)                     -- a character has one skill = one record
);
