CREATE TABLE users (
    id serial NOT NULL,
    username character varying(100) NOT NULL DEFAULT ''::character varying,
    account character varying(200) NOT NULL DEFAULT ''::character varying,  -- Email Account
    password character varying(200) NOT NULL DEFAULT ''::character varying,
    sex character(1) NOT NULL DEFAULT 'U'::bpchar,                          -- 'M': Male, 'F':Female, 'U':Unknown
    phone character varying(50) NOT NULL DEFAULT ''::character varying,
    theme character varying(100) NOT NULL DEFAULT''::character varying,   	-- User Theme
    address character varying(300) NOT NULL DEFAULT''::character varying,
    rank character(1) NOT NULL DEFAULT 'C'::bpchar,                         -- 'C': Client, A' => 'Administrator' 
    flag_verified boolean NOT NULL DEFAULT FALSE,             				-- Set to 1 if the user has verified their account via email, 0 otherwise.
    flag_enabled boolean NOT NULL DEFAULT TRUE,              				-- Set to 1 if the user account enabled loggined, 0 is disabled.
                                        									-- Disabled account can't login, but retein all of  their data and settings.
    
    token text DEFAULT NULL,                                                -- token = openssl(ip + user_agent + userId) + session_id
    create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_access_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE users
OWNER TO admin;
  
CREATE INDEX user_key1
  ON users
  USING btree
  (id, account COLLATE pg_catalog."default", username COLLATE pg_catalog."default");

CREATE INDEX user_key2
  ON users
  USING btree
  (id, sex, phone COLLATE pg_catalog."default", flag_verified, flag_enabled, last_access_time);


CREATE TRIGGER trigger_last_access_time BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_last_access_time_column();

INSERT INTO users (username, account, password) VALUES('', '', '$2a$10$089f1a6e6f8f5e61f276fuE1o4I2nepOIUBm08Y7oDBsyyHWMSRkC');

