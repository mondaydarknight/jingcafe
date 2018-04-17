CREATE TABLE products
(
  sid serial NOT NULL,
  name character varying(50) NOT NULL DEFAULT ''::character varying,
  amount integer NOT NULL DEFAULT 0,                                          -- storage amount
  serialid character varying(20) NOT NULL DEFAULT ''::character varying,     -- product id
  price integer NOT NULL DEFAULT 0,                                           
  image character varying(50) NOT NULL DEFAULT ''::character varying,
  introduction character varying(100) NOT NULL DEFAULT ''::character varying,
  context text NOT NULL DEFAULT '',
  countryid smallint NOT NULL DEFAULT 0,                                      -- country from id
  deliverid smallint NOT NULL DEFAULT 0,
  materialid smallint NOT NULL DEFAULT 0,
  shopid smallint NOT NULL DEFAULT 0,
  status character(1) NOT NULL DEFAULT 'O'::bpchar,                           -- O => ON  D => DISABLE
  releasedate bigint NOT NULL DEFAULT 0,
  CONSTRAINT products_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE products
  OWNER TO admin;

-- Index: product_key2

-- DROP INDEX product_key2;

CREATE INDEX products_key2
  ON products
  USING btree
  (id, serialid COLLATE pg_catalog."default", price, image COLLATE pg_catalog."default");

-- Index: product_key3

-- DROP INDEX product_key3;

CREATE INDEX products_key3
  ON products
  USING btree
  (id, releasedate);

