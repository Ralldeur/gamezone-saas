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

  const station = await prisma.station.findFirst({
    where: { id, roomId: session.user.roomId },
  });

  if (!station) {
    return NextResponse.json({ error: "Station non trouvée" }, { status: 404 });
  }

  const updated = await prisma.station.update({
    where: { id },
    data: body,
  });

  await prisma.activityLog.create({
    data: {
      action: "STATION_UPDATED",
      description: `Station "${updated.name}" modifiée`,
      userId: session.user.id,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const station = await prisma.station.findFirst({
    where: { id, roomId: session.user.roomId },
  });

  if (!station) {
    return NextResponse.json({ error: "Station non trouvée" }, { status: 404 });
  }

  await prisma.station.delete({ where: { id } });

  await prisma.activityLog.create({
    data: {
      action: "STATION_DELETED",
      description: `Station "${station.name}" supprimée`,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
