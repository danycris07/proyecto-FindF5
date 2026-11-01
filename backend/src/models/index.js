import { defineField, defineFieldReservation } from "./field.model.js";
import { defineMatch, defineMatchParticipant } from "./match.model.js";
import { defineSession } from "./session.model.js";
import { defineTeam, defineTeamMember } from "./team.model.js";
import { defineUser } from "./user.model.js";

export function defineModels(sequelize) {
  const User = defineUser(sequelize);
  const Team = defineTeam(sequelize);
  const TeamMember = defineTeamMember(sequelize);
  const Field = defineField(sequelize);
  const FieldReservation = defineFieldReservation(sequelize);
  const Match = defineMatch(sequelize);
  const MatchParticipant = defineMatchParticipant(sequelize);
  const Session = defineSession(sequelize);

  User.hasMany(Team, { as: "captainedTeams", foreignKey: "captainId" });
  Team.belongsTo(User, { as: "captain", foreignKey: "captainId" });
  User.belongsToMany(Team, {
    as: "teams",
    through: TeamMember,
    foreignKey: "userId",
    otherKey: "teamId",
  });
  Team.belongsToMany(User, {
    as: "members",
    through: TeamMember,
    foreignKey: "teamId",
    otherKey: "userId",
  });

  User.hasMany(Field, { as: "ownedFields", foreignKey: "ownerId" });
  Field.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
  Field.hasMany(FieldReservation, {
    as: "reservations",
    foreignKey: "fieldId",
  });
  FieldReservation.belongsTo(Field, { as: "field", foreignKey: "fieldId" });
  User.hasMany(FieldReservation, {
    as: "fieldReservations",
    foreignKey: "userId",
  });
  FieldReservation.belongsTo(User, { as: "user", foreignKey: "userId" });

  User.hasMany(Match, { as: "organizedMatches", foreignKey: "organizerId" });
  Match.belongsTo(User, { as: "organizer", foreignKey: "organizerId" });
  Team.hasMany(Match, { as: "matches", foreignKey: "teamId" });
  Match.belongsTo(Team, { as: "team", foreignKey: "teamId" });
  Field.hasMany(Match, { as: "matches", foreignKey: "fieldId" });
  Match.belongsTo(Field, { as: "field", foreignKey: "fieldId" });
  Match.belongsToMany(User, {
    as: "participants",
    through: MatchParticipant,
    foreignKey: "matchId",
    otherKey: "userId",
  });
  User.belongsToMany(Match, {
    as: "joinedMatches",
    through: MatchParticipant,
    foreignKey: "userId",
    otherKey: "matchId",
  });
  User.hasMany(Session, { as: "sessions", foreignKey: "userId" });
  Session.belongsTo(User, { as: "user", foreignKey: "userId" });

  return {
    User,
    Team,
    TeamMember,
    Field,
    FieldReservation,
    Match,
    MatchParticipant,
    Session,
  };
}
