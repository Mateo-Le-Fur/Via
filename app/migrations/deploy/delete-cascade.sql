-- Deploy via:delete-cascade to pg

BEGIN;

DROP TABLE "activity_has_type";

DROP TABLE  "user_has_activity";

DROP TABLE "user_to_activity";

DROP TABLE "comment";

DROP TABLE "activity";



CREATE TABLE "activity" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "lat" TEXT NOT NULL,
  "long" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "comment" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "text" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "activity_id" int NOT NULL REFERENCES activity(id) ON DELETE CASCADE
);

CREATE TABLE "user_has_activity" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" int NOT NULL REFERENCES "user"(id),
    "activity_id" int NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE "user_to_activity" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" int NOT NULL REFERENCES "user"(id),
    "activity_id" int NOT NULL REFERENCES activity(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "activity_has_type" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "type_id" int NOT NULL REFERENCES type(id),
    "activity_id" int NOT NULL REFERENCES activity(id),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
