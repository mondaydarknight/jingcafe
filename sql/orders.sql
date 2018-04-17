CREATE TABLE orders
(
  id bigserial NOT NULL,
  username character varying(100) NOT NULL DEFAULT ''::character varying,
  phone character varying(50) NOT NULL DEFAULT ''::character varying,
  email character varying(300) NOT NULL DEFAULT ''::character varying,
  list json,                                                            -- Order List JSON
  total_price numeric NOT NULL DEFAULT 0 CHECK(total_price >= 0),
  payment_id smallint NOT NULL DEFAULT 0,                               -- UserPayment
  logistic_id smallint NOT NULL DEFAULT 0,                              -- UserLogistics ID
  message text NOT NULL DEFAULT '',
  is_pay boolean NOT NULL DEFAULT FALSE,
  order_status character(1) NOT NULL DEFAULT 'E'::bpchar,               -- E => ENABLE, D => DISABLE, C => COMPLETE  
  user_id integer NOT NULL DEFAULT 0,                                   -- User 
  checkout_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_deadline timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  production_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prize smallint NOT NULL DEFAULT 0 CHECK(prize >= 0),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE orders
  OWNER TO admin;

CREATE INDEX orders_key1
  ON orders
  USING btree
  (id, username COLLATE pg_catalog."default");

CREATE INDEX orders_key2
  ON orders
  USING btree
  (id, total_price, email COLLATE pg_catalog."default", phone COLLATE pg_catalog."default");
