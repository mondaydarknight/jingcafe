-- TRIGGER ON UPDATE CURRENT_TIMESTAMP...
CREATE FUNCTION update_last_access_time_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.last_access_time = NOW();
    RETURN NEW;
  END;
$$;  