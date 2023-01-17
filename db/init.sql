CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    name CHARACTER(255) NOT NULL UNIQUE,
    password_hash CHARACTER(255) NOT NULL,
    does_have_skeletal_type BOOLEAN NOT NULL DEFAULT FALSE,
    gender CHARACTER(255) NOT NULL DEFAULT '',
    skeletal_type CHARACTER(255) NOT NULL DEFAULT ''
);
