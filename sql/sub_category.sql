CREATE TABLE sub_category
(
	id serial NOT NULL,
	name character varying(100) NOT NULL DEFAULT ''::character varying,
  	uri character(100) NOT NULL DEFAULT ''::bpchar,
  	category_id smallint NOT NULL DEFAULT 0,                  
  	CONSTRAINT sub_category_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sub_category
OWNER TO admin;
  
CREATE INDEX sub_category_key1
  ON sub_category
  USING btree
  (id, uri, category_id);
