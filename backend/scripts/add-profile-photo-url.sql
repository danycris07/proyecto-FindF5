-- Idempotent migration for existing MySQL installations.
SET @profile_photo_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'profile_photo_url'
);

SET @profile_photo_migration = IF(
  @profile_photo_column_exists = 0,
  'ALTER TABLE users ADD COLUMN profile_photo_url VARCHAR(2048) NULL',
  'SELECT ''profile_photo_url already exists'''
);

PREPARE profile_photo_statement FROM @profile_photo_migration;
EXECUTE profile_photo_statement;
DEALLOCATE PREPARE profile_photo_statement;
