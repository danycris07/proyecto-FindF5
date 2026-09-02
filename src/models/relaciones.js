import { UserModel } from "./user.model.js";
import { TeamModel } from "./team.model.js";
import { FieldModel } from "./field.model.js";
import { FieldReservationModel } from "./fieldReservation.model.js";
import { MatchModel } from "./match.model.js";
import { PlayerApplicationModel } from "./playerApplication.model.js";
import { PlayerRequestModel } from "./playerRequest.model.js";
import { ProfileModel } from "./profile.model.js";

UserModel.hasMany(TeamModel, { foreignKey: "captainId", as: "captainedTeams" });
TeamModel.belongsTo(UserModel, { foreignKey: "captainId", as: "captain" });

UserModel.belongsToMany(TeamModel, { through: "TeamMember", as: "teams" });
TeamModel.belongsToMany(UserModel, { through: "TeamMember", as: "players" });

UserModel.hasOne(ProfileModel, {
  foreignKey: "userId",
});

ProfileModel.belongsTo(UserModel, {
  foreignKey: "userId",
});

// Relación: Quién organizó el Partido
TeamModel.hasMany(MatchModel, { foreignKey: "teamId", as: "matches" });
MatchModel.belongsTo(TeamModel, { foreignKey: "teamId", as: "team" });

// Relación: Quién hizo la Reserva de la Cancha
UserModel.hasMany(FieldReservationModel, {
  foreignKey: "userId",
  as: "reservations",
});
FieldReservationModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});

// Relación con el Usuario (Dueño)
// Un usuario (dueño de cancha) puede tener MUCHAS canchas
UserModel.hasMany(FieldModel, { foreignKey: "ownerId", as: "fields" });
// Una cancha pertenece a UN solo usuario
FieldModel.belongsTo(UserModel, { foreignKey: "ownerId", as: "owner" });

// Relación con Reservas
// Una cancha tiene MUCHAS reservas
FieldModel.hasMany(FieldReservationModel, {
  foreignKey: "fieldId",
  as: "reservations",
});
FieldReservationModel.belongsTo(FieldModel, {
  foreignKey: "fieldId",
  as: "field",
});

// Una cancha es sede de MUCHOS partidos
FieldModel.hasMany(MatchModel, { foreignKey: "fieldId", as: "matches" });
MatchModel.belongsTo(FieldModel, { foreignKey: "fieldId", as: "field" });

MatchModel.hasMany(PlayerRequestModel, {
  foreignKey: "matchId",
  as: "playerRequests",
});
PlayerRequestModel.belongsTo(MatchModel, {
  foreignKey: "matchId",
  as: "match",
});

// Una publicación tiene a varios pibes postulándose
PlayerRequestModel.hasMany(PlayerApplicationModel, {
  foreignKey: "playerRequestId",
  as: "applications",
});
PlayerApplicationModel.belongsTo(PlayerRequestModel, {
  foreignKey: "playerRequestId",
  as: "request",
});

// Para saber a cuántas búsquedas se anotó un usuario
UserModel.hasMany(PlayerApplicationModel, {
  foreignKey: "userId",
  as: "playerApplications",
});
PlayerApplicationModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});

MatchModel.hasMany(MatchPlayerModel, {
  foreignKey: "matchId",
  as: "confirmedPlayers",
});
MatchPlayerModel.belongsTo(MatchModel, { foreignKey: "matchId", as: "match" });

// Un usuario puede estar confirmado en muchos partidos
UserModel.hasMany(MatchPlayerModel, {
  foreignKey: "userId",
  as: "matchesToPlay",
});
MatchPlayerModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
