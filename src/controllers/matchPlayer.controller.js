import { matchedData } from "express-validator";
import { PlayerApplicationModel } from "../models/playerApplication.model.js";
import { PlayerRequestModel } from "../models/playerRequest.model.js";
import { MatchModel } from "../models/match.model.js";
import { MatchPlayerModel } from "../models/matchPlayer.model.js";

export const aceptarSolicitudJugador = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const solicitud = await PlayerApplicationModel.findByPk(id);

    const busqueda = await PlayerRequestModel.findByPk(
      solicitud.playerRequestId,
    );

    const partido = await MatchModel.findByPk(busqueda.matchId);

    const cantidadJugadores = await MatchPlayerModel.count({
      where: {
        matchId: partido.id,
      },
    });

    if (cantidadJugadores >= partido.maxPlayers) {
      return res.status(400).json({
        message: "El partido ya está completo",
      });
    }

    await MatchPlayerModel.create({
      matchId: partido.id,
      userId: solicitud.userId,
    });

    await PlayerApplicationModel.update(
      {
        status: "ACCEPTED",
      },
      {
        where: {
          id,
        },
      },
    );

    const nuevosJugadores = cantidadJugadores + 1;

    if (nuevosJugadores >= partido.maxPlayers) {
      await MatchModel.update(
        {
          status: "FULL",
        },
        {
          where: {
            id: partido.id,
          },
        },
      );

      await PlayerRequestModel.update(
        {
          status: "CLOSED",
          playersNeeded: 0,
        },
        {
          where: {
            id: busqueda.id,
          },
        },
      );
    } else {
      await PlayerRequestModel.update(
        {
          playersNeeded: busqueda.playersNeeded - 1,
        },
        {
          where: {
            id: busqueda.id,
          },
        },
      );
    }

    res.status(200).json({
      message: "Jugador aceptado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al aceptar al jugador",
    });
  }
};
export const crearSolicitudJugador = async (req, res) => {
  try {
    const datos = matchedData(req);

    const solicitud = await PlayerApplicationModel.create(datos);

    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la solicitud",
    });
  }
};
