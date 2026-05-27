import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = {
    station: { roomId: session.user.roomId },
  };

  if (status) {
    where.status = status;
  }

  const gameSessions = await prisma.gameSession.findMany({
    where,
    include: {
      station: true,
      startedBy: { select: { name: true } },
      payment: true,
    },
    orderBy: { startTime: "desc" },
    take: limit,
  });

  return NextResponse.json(gameSessions);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { stationId, customerName, plannedDuration } = body;

  if (!stationId) {
    return NextResponse.json(
      { error: "Station requise" },
      { status: 400 }
    );
  }

  const station = await prisma.station.findFirst({
    where: { id: stationId, roomId: session.user.roomId },
  });

  if (!station) {
    return NextResponse.json(
      { error: "Station non trouvée" },
      { status: 404 }
    );
  }

  if (station.status !== "FREE") {
    return NextResponse.json(
      { error: "Station non disponible" },
      { status: 400 }
    );
  }

  const [gameSession] = await prisma.$transaction([
    prisma.gameSession.create({
      data: {
        stationId,
        startedById: session.user.id,
        customerName: customerName || null,
        plannedDuration: plannedDuration || null,
      },
      include: {
        station: true,
        startedBy: { select: { name: true } },
      },
    }),
    prisma.station.update({
      where: { id: stationId },
      data: { status: "OCCUPIED" },
    }),
  ]);

  await prisma.activityLog.create({
    data: {
      action: "SESSION_STARTED",
      description: `Session démarrée sur ${station.name}${customerName ? ` pour ${customerName}` : ""}`,
      userId: session.user.id,
    },
  });

  return NextResponse.json(gameSession, { status: 201 });
}
