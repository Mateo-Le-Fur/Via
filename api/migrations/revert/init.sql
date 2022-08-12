-- Revert via:init from pg

BEGIN;

DROP TABLE "activity_has_type", "user_to_activity", "user_has_activity", "type", "comment", "message", "activity", "user";

COMMIT;
