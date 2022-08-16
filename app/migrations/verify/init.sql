-- Verify via:init on pg

BEGIN;

SELECT * FROM "activity" WHERE false;

SELECT * FROM "user" WHERE false;

SELECT * FROM "message" WHERE false;

SELECT * FROM "comment" WHERE false;

SELECT * FROM "type" WHERE false;

SELECT * FROM "user_has_activity" WHERE false;

SELECT * FROM "user_to_activity" WHERE false;

SELECT * FROM "activity_has_type" WHERE false;

ROLLBACK;
