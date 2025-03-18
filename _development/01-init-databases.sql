CREATE USER payment WITH PASSWORD 'payment' CREATEDB;
CREATE DATABASE payment
    WITH
    OWNER = payment
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE USER attachments WITH PASSWORD 'attachments' CREATEDB;
CREATE DATABASE attachments
    WITH
    OWNER = attachments
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
