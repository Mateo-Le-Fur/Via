-- Deploy via:coordinates to pg

BEGIN;

ALTER TABLE "user"
ADD COLUMN "lat" TEXT,
ADD COLUMN "long" TEXT;

COMMIT;
