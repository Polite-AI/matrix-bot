DROP TABLE IF EXISTS messages;
DROP SEQUENCE IF EXISTS message_seq;

-- Messages table:
-- message_id auto assigned ID for use when we reference from other tables
-- message: full printable text of message
-- classifier: ID of engine which was used to produce derived
-- derived: JSON object representing classification we received fomr the engine
-- corrected: Subsequent correction  based on human input
-- room_key: A large key that secures this room
-- room_provider: chat system ID e.g. 'matrix', 'slack' etc
-- room_id: ID of room, unique within namespace of room provider




CREATE TABLE messages (
          message_id BIGINT DEFAULT nextval('message_seq'::text),
	  message TEXT NOT NULL,
    user_id TEXT,
	  event_id TEXT,
	  time TIMESTAMP,
	  classifier TEXT,
	  derived TEXT,
	  corrected TEXT,
	  room_provider TEXT,
	  room_key TEXT,
	  room_id TEXT
);



CREATE SEQUENCE message_seq start 100 increment 1 cache 20;

grant all on DATABASE polite TO polite;
grant all on table messages TO polite;
grant all on SEQUENCE message_seq TO polite;
