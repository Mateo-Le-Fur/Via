-- Verify via:coordinates on pg

BEGIN;

SELECT lat, long FROM "user" WHERE false;

ROLLBACK;
