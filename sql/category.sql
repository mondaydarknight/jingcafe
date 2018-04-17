CREATE TABLE category
(
	id serial NOT NULL,
	name character varying(100) NOT NULL DEFAULT ''::character varying,
  	uri character(100) NOT NULL DEFAULT ''::bpchar, 
  	CONSTRAINT category_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE category
OWNER TO admin;
  
CREATE INDEX category_key1
  ON category
  USING btree
  (id, uri);
