-- Idempotent migration for existing MySQL installations.
SET @phone_visibility_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'is_phone_visible'
);

SET @phone_visibility_migration = IF(
  @phone_visibility_column_exists = 0,
  'ALTER TABLE users ADD COLUMN is_phone_visible TINYINT(1) NOT NULL DEFAULT 1',
  'SELECT ''is_phone_visible already exists'''
);

PREPARE phone_visibility_statement FROM @phone_visibility_migration;
EXECUTE phone_visibility_statement;
DEALLOCATE PREPARE phone_visibility_statement;
