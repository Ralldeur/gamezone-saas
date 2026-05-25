import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { roomId: session.user.roomId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(notifications);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (id) {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { roomId: session.user.roomId, read: false },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
