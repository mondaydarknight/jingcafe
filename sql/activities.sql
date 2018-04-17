CREATE TABLE activities
(
  id bigserial NOT NULL,
  title character varying(60) NOT NULL DEFAULT ''::character varying,
  context character varying(40) NOT NULL DEFAULT ''::character varying,
  shop_id integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attachment character varying(200) NOT NULL DEFAULT ''::character varying,
  view_level character(1) NOT NULL DEFAULT 'A'::bpchar,						
  CONSTRAINT activities_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
)
ALTER TABLE activities
  OWNER TO admin;

CREATE INDEX activities_key1
  ON activities
  USING btree
  (id, title COLLATE pg_catalog."default", context COLLATE pg_catalog."default", attachment COLLATE pg_catalog."default");

