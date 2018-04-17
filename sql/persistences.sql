CREATE TABLE persistences
(
  id serial NOT NULL,
  token character varying(100) NOT NULL DEFAULT ''::character varying,
  persistence_token character varying(100) NOT NULL DEFAULT ''::character varying,
  user_id integer NOT NULL DEFAULT 0,
  expired_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT persistences_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

ALTER TABLE persistences
  OWNER TO admin;

CREATE INDEX persistences_key1
  ON persistences
  USING btree
  (id, token COLLATE pg_catalog."default", persistence_token, user_id);

CREATE INDEX persistences_key2
  ON persistences
  USING btree
  (id, expired_at);
