CREATE TABLE material
(
	id serial NOT NULL,
	name character varying(100) NOT NULL DEFAULT ''::character varying,
  	index character(20) NOT NULL DEFAULT ''::bpchar,                      
  	CONSTRAINT material_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE material
OWNER TO admin;
  
CREATE INDEX material_key1
  ON material
  USING btree
  (id, name COLLATE pg_catalog."default");

