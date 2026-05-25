import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const stations = await prisma.station.findMany({
    where: { roomId: session.user.roomId },
    include: {
      sessions: {
        where: { status: { in: ["ACTIVE", "PAUSED"] } },
        include: { startedBy: { select: { name: true } } },
        take: 1,
        orderBy: { startTime: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(stations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { name, type, hourlyRate } = body;

  if (!name || !type) {
    return NextResponse.json(
      { error: "Nom et type requis" },
      { status: 400 }
    );
  }

  const station = await prisma.station.create({
    data: {
      name,
      type,
      hourlyRate: hourlyRate || null,
      roomId: session.user.roomId,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "STATION_CREATED",
      description: `Station "${name}" (${type}) créée`,
      userId: session.user.id,
    },
  });

  return NextResponse.json(station, { status: 201 });
}
