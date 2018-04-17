CREATE TABLE message
(
  	id serial NOT NULL,
  	subject character varying(50) NOT NULL DEFAULT ''::character varying,
  	body character varying(1000) NOT NULL DEFAULT ''::character varying,
  	attachment character varying(100) NOT NULL DEFAULT ''::character varying,
  	userid bigint NOT NULL DEFAULT 0,
  	tag character(1) NOT NULL DEFAULT 'C'::bpchar,							-- 'C': 'Customer' 'D': 'Deliver'
   	status character(1) NOT NULL DEFAULT ''::bpchar,						-- '' : none 'D' : disable
    date timestamp DEFAULT CURRENT_TIMESTAMP,
  	CONSTRAINT message_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE message
OWNER TO admin;
  
CREATE INDEX message_key1
  ON message
  USING btree
  (id, name COLLATE pg_catalog."default", subject COLLATE pg_catalog."default");

