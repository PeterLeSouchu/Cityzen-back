
BEGIN;

DROP TABLE IF EXISTS "raiting_activity" CASCADE;
DROP TABLE IF EXISTS "user_raiting" CASCADE;
DROP TABLE IF EXISTS "favorite_activity" CASCADE;
DROP TABLE IF EXISTS "raiting" CASCADE;
DROP TABLE IF EXISTS "activity" CASCADE;
DROP TABLE IF EXISTS "zip_code" CASCADE;
DROP TABLE IF EXISTS "city" CASCADE;
DROP TABLE IF EXISTS "department" CASCADE;
DROP TABLE IF EXISTS "country" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;


CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "pseudo" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);


CREATE TABLE "country" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);
CREATE TABLE "department" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL UNIQUE,
  "id_country" INT NOT NULL REFERENCES "country" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);


CREATE TABLE "city" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "id_department" INT NOT NULL REFERENCES "department" ("id"),
  "id_country" INT NOT NULL REFERENCES "country" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "zip_code" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "zip_code" TEXT NOT NULL UNIQUE,
  "id_city" INT NOT NULL REFERENCES "city" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "activity" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "url_image" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "phone" TEXT,
  "avg_note" INT,
  "latitude" NUMERIC NOT NULL,
  "longitude" NUMERIC NOT NULL,
  "id_user" INT NOT NULL REFERENCES "user" ("id"),
  "id_city" INT NOT NULL REFERENCES "city" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);
CREATE TABLE "raiting" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "note" INT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);


-- Tables de liaison
CREATE TABLE "favorite_activity" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "id_user" INTEGER NOT NULL REFERENCES "user" ("id"),
  "id_activity" INTEGER NOT NULL REFERENCES "activity" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ,
  UNIQUE (id_user, id_activity)
);
CREATE TABLE "user_raiting" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "id_user" INT NOT NULL REFERENCES "user" ("id"),
  "id_note" INT NOT NULL REFERENCES "note" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "raiting_activity" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "id_activity" INT NOT NULL REFERENCES "activity" ("id"),
  "id_note" INT NOT NULL REFERENCES "note" ("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ
);

ALTER SEQUENCE "user_id_seq" RESTART WITH 1;
ALTER SEQUENCE "country_id_seq" RESTART WITH 1;
ALTER SEQUENCE "department_id_seq" RESTART WITH 1;
ALTER SEQUENCE "city_id_seq" RESTART WITH 1;
ALTER SEQUENCE "zip_code_id_seq" RESTART WITH 1;
ALTER SEQUENCE "activity_id_seq" RESTART WITH 1;
ALTER SEQUENCE "raiting_id_seq" RESTART WITH 1;
ALTER SEQUENCE "user_raiting_id_seq" RESTART WITH 1;
ALTER SEQUENCE "raiting_activity_id_seq" RESTART WITH 1;


COMMIT;