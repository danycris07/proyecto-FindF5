import { UserModel } from "./User.model.js";
import { TeamModel } from "./Team.model.js";

UserModel.hasMany(TeamModel, { foreignKey: "captainId", as: "captainedTeams" });
TeamModel.belongsTo(UserModel, { foreignKey: "captainId", as: "captain" });

UserModel.belongsToMany(TeamModel, { through: "TeamMember", as: "teams" });
TeamModel.belongsToMany(UserModel, { through: "TeamMember", as: "players" });
