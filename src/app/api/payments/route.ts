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
  const limit = parseInt(searchParams.get("limit") || "50");
  const method = searchParams.get("method");

  const where: Record<string, unknown> = {
    session: { station: { roomId: session.user.roomId } },
  };

  if (method) {
    where.method = method;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      session: {
        include: {
          station: { select: { name: true, type: true } },
        },
      },
      createdBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(payments);
}
