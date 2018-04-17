-- The table name need to modify. products

CREATE TABLE product
(
    id serial NOT NULL,
    name character varying(50) NOT NULL DEFAULT ''::character varying,
    amount integer NOT NULL DEFAULT 0,                                              -- storage amount
    product_key character varying(20) NOT NULL DEFAULT ''::character varying,       -- product identified key
    price integer NOT NULL DEFAULT 0,                                           
    profile character varying(50) NOT NULL DEFAULT ''::character varying,
    purchase_times medianinteger NOT NULL DEFAULT 0 CHECK(purchase_times >= 0),           -- record product purchase time
    characteristic character varying(100) NOT NULL DEFAULT ''::character varying,   -- brief introduce product
    description text NOT NULL DEFAULT '',
    locale_id smallint NOT NULL DEFAULT 0,                                          -- Locale from id
    logistics_id smallint NOT NULL DEFAULT 0,
    last_category_id smallint NOT NULL DEFAULT 0,                                   -- Product category id
    shop_id smallint NOT NULL DEFAULT 0,                                            -- Shop id
    flag_enabled boolean NOT NULL DEFAULT TRUE,                                     -- Set TRUE if the product is on sell, otherwise FALSE is unsell.
    last_update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE product
  OWNER TO admin;


CREATE TRIGGER trigger_last_update_time BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_last_access_time_column();

CREATE INDEX product_key1
  ON product
  USING btree
  (id, product_key COLLATE pg_catalog."default", price, profile COLLATE pg_catalog."default");

