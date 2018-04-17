CREATE TABLE shop
(
  id bigserial NOT NULL,
  name character varying(60) NOT NULL DEFAULT ''::character varying,
  brand character varying(40) NOT NULL DEFAULT ''::character varying,
  phone character varying(30) NOT NULL DEFAULT ''::character varying,
  email character varying(100) NOT NULL DEFAULT ''::character varying,
  address character varying(200) NOT NULL DEFAULT ''::character varying,
  introduction character varying(200) NOT NULL DEFAULT ''::character varying,                                             -- Order List JSON
  start_time time without time zone NOT NULL DEFAULT '00:00:00',
  end_time time without time zone NOT NULL DEFAULT '00:00:00',
  advertisements character varying[] NOT NULL DEFAULT '{}',
  opening_day character varying(20) NOT NULL DEFAULT ''::character varying,
  shop_owner_id integer NOT NULL DEFAULT 0,                                           -- User 
  flag_enabled boolean NOT NULL DEFAULT TRUE,
  CONSTRAINT shop_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE shop
  OWNER TO admin;

CREATE INDEX shop_key1
  ON shop
  USING btree
  (id, name COLLATE pg_catalog."default", phone COLLATE pg_catalog."default", email COLLATE pg_catalog."default", address COLLATE pg_catalog."default");

