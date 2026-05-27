import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  const gameSession = await prisma.gameSession.findFirst({
    where: {
      id,
      station: { roomId: session.user.roomId },
    },
    include: { station: true },
  });

  if (!gameSession) {
    return NextResponse.json(
      { error: "Session non trouvée" },
      { status: 404 }
    );
  }

  let updated;
  const hourlyRate = gameSession.station.hourlyRate ?? 500;

  switch (action) {
    case "pause": {
      if (gameSession.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "La session n'est pas active" },
          { status: 400 }
        );
      }
      updated = await prisma.gameSession.update({
        where: { id },
        data: { status: "PAUSED", pausedAt: new Date() },
        include: { station: true, startedBy: { select: { name: true } } },
      });
      break;
    }

    case "resume": {
      if (gameSession.status !== "PAUSED" || !gameSession.pausedAt) {
        return NextResponse.json(
          { error: "La session n'est pas en pause" },
          { status: 400 }
        );
      }
      const pauseDuration = Math.floor(
        (Date.now() - new Date(gameSession.pausedAt).getTime()) / 1000
      );
      updated = await prisma.gameSession.update({
        where: { id },
        data: {
          status: "ACTIVE",
          pausedAt: null,
          totalPausedDuration: gameSession.totalPausedDuration + pauseDuration,
        },
        include: { station: true, startedBy: { select: { name: true } } },
      });
      break;
    }

    case "stop": {
      if (!["ACTIVE", "PAUSED"].includes(gameSession.status)) {
        return NextResponse.json(
          { error: "La session est déjà terminée" },
          { status: 400 }
        );
      }

      let totalPaused = gameSession.totalPausedDuration;
      if (gameSession.status === "PAUSED" && gameSession.pausedAt) {
        totalPaused += Math.floor(
          (Date.now() - new Date(gameSession.pausedAt).getTime()) / 1000
        );
      }

      const endTime = new Date();
      const totalSeconds =
        Math.floor(
          (endTime.getTime() - new Date(gameSession.startTime).getTime()) / 1000
        ) - totalPaused;
      const hours = Math.max(totalSeconds / 3600, 0);
      const amount = Math.round(hours * hourlyRate);

      const paymentMethod = body.paymentMethod || "CASH";

      const [updatedSession] = await prisma.$transaction([
        prisma.gameSession.update({
          where: { id },
          data: {
            status: "COMPLETED",
            endTime,
            pausedAt: null,
            totalPausedDuration: totalPaused,
          },
          include: {
            station: true,
            startedBy: { select: { name: true } },
            payment: true,
          },
        }),
        prisma.station.update({
          where: { id: gameSession.stationId },
          data: { status: "FREE" },
        }),
        prisma.payment.create({
          data: {
            amount,
            method: paymentMethod,
            sessionId: id,
            createdById: session.user.id,
          },
        }),
      ]);

      updated = updatedSession;

      await prisma.activityLog.create({
        data: {
          action: "SESSION_COMPLETED",
          description: `Session terminée sur ${gameSession.station.name} - ${amount} FCFA`,
          userId: session.user.id,
        },
      });
      break;
    }

    case "cancel": {
      if (!["ACTIVE", "PAUSED"].includes(gameSession.status)) {
        return NextResponse.json(
          { error: "La session est déjà terminée" },
          { status: 400 }
        );
      }

      const [cancelledSession] = await prisma.$transaction([
        prisma.gameSession.update({
          where: { id },
          data: {
            status: "CANCELLED",
            endTime: new Date(),
            pausedAt: null,
          },
          include: {
            station: true,
            startedBy: { select: { name: true } },
          },
        }),
        prisma.station.update({
          where: { id: gameSession.stationId },
          data: { status: "FREE" },
        }),
      ]);

      updated = cancelledSession;
      break;
    }

    default:
      return NextResponse.json(
        { error: "Action invalide" },
        { status: 400 }
      );
  }

  return NextResponse.json(updated);
}
