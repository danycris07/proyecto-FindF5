import { UserModel } from "./User.model.js";
import { TeamModel } from "./Team.model.js";
import { FieldModel } from "./Field.model.js";
import { FieldReservationModel } from "./FieldReservation.model.js";
import { MatchModel } from "./Match.model.js";
UserModel.hasMany(TeamModel, { foreignKey: "captainId", as: "captainedTeams" });
TeamModel.belongsTo(UserModel, { foreignKey: "captainId", as: "captain" });

UserModel.belongsToMany(TeamModel, { through: "TeamMember", as: "teams" });
TeamModel.belongsToMany(UserModel, { through: "TeamMember", as: "players" });

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

// Relación con Partidos
// Una cancha es sede de MUCHOS partidos
FieldModel.hasMany(MatchModel, { foreignKey: "fieldId", as: "matches" });
MatchModel.belongsTo(FieldModel, { foreignKey: "fieldId", as: "field" });
