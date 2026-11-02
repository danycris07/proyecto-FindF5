import {
  clearSessionCookie,
  hashSessionToken,
  readSessionToken,
} from "../auth/session-cookie.js";

export function createRequireAuth(models) {
  return async function requireAuth(request, response, next) {
    const token = readSessionToken(request);
    if (!token) {
      return response
        .status(401)
        .json({ message: "Iniciá sesión para continuar." });
    }

    const session = await models.Session.findOne({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });

    if (!session || new Date(session.expiresAt) <= new Date()) {
      if (session) {
        await session.destroy();
      }
      clearSessionCookie(response, process.env.NODE_ENV === "production");
      return response
        .status(401)
        .json({ message: "Iniciá sesión para continuar." });
    }

    const user = await models.User.findByPk(session.userId, {
      include: [{ model: models.Profile, as: "profile" }],
    });
    if (!user) {
      await session.destroy();
      clearSessionCookie(response, process.env.NODE_ENV === "production");
      return response
        .status(401)
        .json({ message: "Iniciá sesión para continuar." });
    }

    request.authUser = user;
    request.authSession = session;
    return next();
  };
}

export function requireRole(...roles) {
  return function authorizeRole(request, response, next) {
    if (!request.authUser || !roles.includes(request.authUser.role)) {
      return response
        .status(403)
        .json({ message: "No tenés permiso para realizar esta acción." });
    }
    return next();
  };
}
