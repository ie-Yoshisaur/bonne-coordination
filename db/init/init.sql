CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    does_have_skeletal_type BOOLEAN NOT NULL DEFAULT FALSE,
    gender VARCHAR(255) NOT NULL DEFAULT '',
    skeletal_type VARCHAR(255) NOT NULL DEFAULT ''
);
