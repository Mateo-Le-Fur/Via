-- Revert via:coordinates from pg

BEGIN;

ALTER TABLE "user"
  DROP COLUMN "lat",
  DROP COLUMN "long";

COMMIT;
