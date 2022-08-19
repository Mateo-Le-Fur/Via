

BEGIN;

CREATE DOMAIN "email" AS text CHECK (
   value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
);

CREATE DOMAIN "phone" AS text CHECK (
  value ~ '^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$'
);

CREATE TABLE "user" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" EMAIL NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "nickname" TEXT NOT NULL,
  "firstname" TEXT,
  "lastname" TEXT,
  "description" TEXT,
  "address" TEXT,
  "city" TEXT,
  "phone" PHONE,
  "avatar" TEXT,
  "is_admin" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

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
  "user_id" int NOT NULL REFERENCES "user"("id")
);

CREATE TABLE "message" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  "exp_user_id" int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "dest_user_id" int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE "comment" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "text" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ,
  "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "activity_id" int NOT NULL REFERENCES activity(id) ON DELETE CASCADE
);


CREATE TABLE "type" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "label" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

-- TODO Ajouter un DELETE ON CASCADE sur activity_id
CREATE TABLE "user_has_activity" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" int NOT NULL REFERENCES "user"(id),
    "activity_id" int NOT NULL REFERENCES activity(id), 
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TODO Ajouter un DELETE ON CASCADE sur activity_id
CREATE TABLE "user_to_activity" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" int NOT NULL REFERENCES "user"(id),
    "activity_id" int NOT NULL REFERENCES activity(id),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "activity_has_type" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "type_id" int NOT NULL REFERENCES type(id),
    "activity_id" int NOT NULL REFERENCES activity(id),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



COMMIT;


