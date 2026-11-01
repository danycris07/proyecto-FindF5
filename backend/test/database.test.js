import assert from "node:assert/strict";
import test from "node:test";
import { Sequelize } from "sequelize";
import {
  createDatabaseConnection,
  getDatabaseConfig,
} from "../src/database/connection.js";
import { defineModels } from "../src/models/index.js";

const databaseEnv = {
  DB_HOST: "127.0.0.1",
  DB_PORT: "3306",
  DB_NAME: "findf5_test",
  DB_USER: "findf5_test",
  DB_PASSWORD: "",
};

test("la configuración de MySQL requiere las variables de conexión", () => {
  assert.throws(
    () => getDatabaseConfig({}),
    /DB_HOST, DB_NAME, DB_USER, DB_PASSWORD/,
  );
});

test("la configuración de MySQL valida el puerto", () => {
  assert.throws(
    () => getDatabaseConfig({ ...databaseEnv, DB_PORT: "70000" }),
    /DB_PORT/,
  );
});

test("la configuración rechaza datos de conexión vacíos", () => {
  assert.throws(
    () => getDatabaseConfig({ ...databaseEnv, DB_USER: " " }),
    /DB_USER/,
  );
});

test("la conexión usa MySQL y los parámetros del entorno", () => {
  const sequelize = createDatabaseConnection(databaseEnv);

  assert.equal(sequelize.getDialect(), "mysql");
  assert.equal(sequelize.config.host, databaseEnv.DB_HOST);
  assert.equal(sequelize.config.port, 3306);
  assert.equal(sequelize.config.database, databaseEnv.DB_NAME);
  assert.equal(sequelize.config.username, databaseEnv.DB_USER);

  return sequelize.close();
});

test("los modelos reflejan perfiles, canchas, reservas y partidos", async () => {
  const sequelize = new Sequelize("findf5_test", "test", "", {
    dialect: "mysql",
    logging: false,
  });

  try {
    const models = defineModels(sequelize);
    const userAttributes = models.User.getAttributes();
    const matchAttributes = models.Match.getAttributes();

    assert.deepEqual(Object.keys(models), [
      "User",
      "Team",
      "TeamMember",
      "Field",
      "FieldReservation",
      "Match",
      "MatchParticipant",
      "Session",
    ]);
    assert.deepEqual(userAttributes.role.values, [
      "PLAYER",
      "FIELD_OWNER",
      "ADMIN",
    ]);
    assert.deepEqual(userAttributes.position.values, [
      "FIELD_PLAYER",
      "GOALKEEPER",
    ]);
    assert.equal(userAttributes.passwordHash.allowNull, false);
    assert.equal(userAttributes.reputation.type.key, "JSON");
    assert.equal(matchAttributes.expectedPlayers.validate.min, 1);
    assert.equal(
      models.Match.associations.participants.through.model,
      models.MatchParticipant,
    );
    assert.equal(models.User.options.paranoid, true);

    const playerWithoutPosition = models.User.build({
      name: "Jugador",
      email: "player@example.com",
      passwordHash: "hashed-password",
      role: "PLAYER",
    });
    await playerWithoutPosition.validate();

    const ownerWithPosition = models.User.build({
      name: "Dueño",
      email: "owner@example.com",
      passwordHash: "hashed-password",
      role: "FIELD_OWNER",
      position: "GOALKEEPER",
    });
    await assert.rejects(ownerWithPosition.validate(), /Solo los jugadores/);

    const invalidMatch = models.Match.build({
      fieldName: "Templo de Cracks",
      date: "2026-11-02",
      startTime: "21:00:00",
      expectedPlayers: 0,
      organizerId: 1,
      basePricePerPlayer: 1500,
      pricePerPlayer: 1500,
    });

    await assert.rejects(invalidMatch.validate(), /expectedPlayers/);
  } finally {
    await sequelize.close();
  }
});
