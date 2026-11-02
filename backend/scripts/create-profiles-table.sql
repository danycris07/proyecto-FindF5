-- Ejecutar en phpMyAdmin sobre la base activa. Seguro para volver a ejecutar.
-- profiles centraliza datos personales. La referencia de ubicación es opcional
-- y privada por defecto para que nadie publique una dirección sin querer.
SET @has_profile_photo = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_photo_url'
);
SET @sql = IF(@has_profile_photo = 0,
  'ALTER TABLE users ADD COLUMN profile_photo_url VARCHAR(2048) NULL',
  'SELECT ''profile_photo_url ya existe''');
PREPARE profile_photo_column_stmt FROM @sql;
EXECUTE profile_photo_column_stmt;
DEALLOCATE PREPARE profile_photo_column_stmt;

SET @has_phone_visibility = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_phone_visible'
);
SET @sql = IF(@has_phone_visibility = 0,
  'ALTER TABLE users ADD COLUMN is_phone_visible TINYINT(1) NOT NULL DEFAULT 1',
  'SELECT ''is_phone_visible ya existe''');
PREPARE phone_visibility_column_stmt FROM @sql;
EXECUTE phone_visibility_column_stmt;
DEALLOCATE PREPARE phone_visibility_column_stmt;

CREATE TABLE IF NOT EXISTS profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(120) NULL,
  last_name VARCHAR(120) NULL,
  phone VARCHAR(30) NULL,
  profile_photo_url VARCHAR(2048) NULL,
  is_phone_visible TINYINT(1) NOT NULL DEFAULT 1,
  address VARCHAR(160) NULL,
  is_address_visible TINYINT(1) NOT NULL DEFAULT 0,
  position ENUM('FIELD_PLAYER', 'GOALKEEPER') NULL,
  dominant_foot ENUM('RIGHT', 'LEFT') NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY profiles_user_id_unique (user_id),
  CONSTRAINT profiles_user_id_fk FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Añade los campos también si profiles ya se creó con la versión anterior.
SET @has_first_name = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'profiles' AND COLUMN_NAME = 'first_name'
);
SET @sql = IF(@has_first_name = 0,
  'ALTER TABLE profiles ADD COLUMN first_name VARCHAR(120) NULL AFTER user_id',
  'SELECT ''first_name ya existe''');
PREPARE first_name_column_stmt FROM @sql;
EXECUTE first_name_column_stmt;
DEALLOCATE PREPARE first_name_column_stmt;

SET @has_last_name = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'profiles' AND COLUMN_NAME = 'last_name'
);
SET @sql = IF(@has_last_name = 0,
  'ALTER TABLE profiles ADD COLUMN last_name VARCHAR(120) NULL AFTER first_name',
  'SELECT ''last_name ya existe''');
PREPARE last_name_column_stmt FROM @sql;
EXECUTE last_name_column_stmt;
DEALLOCATE PREPARE last_name_column_stmt;

-- Conserva los nombres existentes: el primer término pasa a nombre y el resto a apellido.
SET @has_user_name = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'
);
SET @sql = IF(@has_user_name > 0,
  'INSERT IGNORE INTO profiles (user_id, first_name, last_name, phone, profile_photo_url, is_phone_visible, position, dominant_foot) SELECT id, SUBSTRING_INDEX(TRIM(name), '' '', 1), IF(LOCATE('' '', TRIM(name)) = 0, '''', TRIM(SUBSTRING(TRIM(name), LOCATE('' '', TRIM(name)) + 1))), phone, profile_photo_url, is_phone_visible, position, dominant_foot FROM users',
  'SELECT ''name ya fue migrado''');
PREPARE copy_user_profiles_stmt FROM @sql;
EXECUTE copy_user_profiles_stmt;
DEALLOCATE PREPARE copy_user_profiles_stmt;

SET @sql = IF(@has_user_name > 0,
  'UPDATE profiles p JOIN users u ON u.id = p.user_id SET p.first_name = SUBSTRING_INDEX(TRIM(u.name), '' '', 1), p.last_name = IF(LOCATE('' '', TRIM(u.name)) = 0, '''', TRIM(SUBSTRING(TRIM(u.name), LOCATE('' '', TRIM(u.name)) + 1))) WHERE p.first_name IS NULL OR p.first_name = ''''',
  'SELECT ''no hay nombres pendientes de copiar''');
PREPARE update_user_names_stmt FROM @sql;
EXECUTE update_user_names_stmt;
DEALLOCATE PREPARE update_user_names_stmt;

ALTER TABLE profiles
  MODIFY first_name VARCHAR(120) NOT NULL,
  MODIFY last_name VARCHAR(120) NOT NULL;

-- Copia perfiles que aún no existan, sin reemplazar datos personales ya guardados.
INSERT IGNORE INTO profiles (user_id, phone, profile_photo_url, is_phone_visible, position, dominant_foot)
SELECT id, phone, profile_photo_url, is_phone_visible, position, dominant_foot FROM users;

-- El nombre deja de pertenecer a users después de verificar y copiar su contenido.
SET @sql = IF(@has_user_name > 0,
  'ALTER TABLE users DROP COLUMN name',
  'SELECT ''users.name ya fue quitado''');
PREPARE drop_user_name_stmt FROM @sql;
EXECUTE drop_user_name_stmt;
DEALLOCATE PREPARE drop_user_name_stmt;
