-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Temporary UUID columns
ALTER TABLE "User"
ADD COLUMN "new_id" UUID;

ALTER TABLE "Task"
ADD COLUMN "new_id" UUID;

ALTER TABLE "Task"
ADD COLUMN "new_userId" UUID;

-- Generate a new UUID for every existing User
UPDATE "User"
SET "new_id" = gen_random_uuid();

-- Generate a new UUID for every existing Task
UPDATE "Task"
SET "new_id" = gen_random_uuid();

-- Preserve Task -> User relationship
UPDATE "Task" t
SET "new_userId" = u."new_id"
FROM "User" u
WHERE t."userId" = u."id";

-- Make sure every existing Task has a matching User
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Task"
        WHERE "new_userId" IS NULL
    ) THEN
        RAISE EXCEPTION 'Migration stopped: some tasks do not have a matching user';
    END IF;
END $$;

-- Remove existing foreign key
ALTER TABLE "Task"
DROP CONSTRAINT "Task_userId_fkey";

-- Remove existing primary keys
ALTER TABLE "Task"
DROP CONSTRAINT "Task_pkey";

ALTER TABLE "User"
DROP CONSTRAINT "User_pkey";

-- Remove old integer columns
ALTER TABLE "Task"
DROP COLUMN "id";

ALTER TABLE "Task"
DROP COLUMN "userId";

ALTER TABLE "User"
DROP COLUMN "id";

-- Rename UUID columns
ALTER TABLE "User"
RENAME COLUMN "new_id" TO "id";

ALTER TABLE "Task"
RENAME COLUMN "new_id" TO "id";

ALTER TABLE "Task"
RENAME COLUMN "new_userId" TO "userId";

-- Make UUID IDs NOT NULL
ALTER TABLE "User"
ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "Task"
ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "Task"
ALTER COLUMN "userId" SET NOT NULL;

-- Recreate primary keys
ALTER TABLE "User"
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

ALTER TABLE "Task"
ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("id");

-- Recreate foreign key
ALTER TABLE "Task"
ADD CONSTRAINT "Task_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Defaults for newly created records
ALTER TABLE "User"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "Task"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();