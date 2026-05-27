import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const roomId = session.user.roomId;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    stations,
    activeSessions,
    todayPayments,
    monthPayments,
    todaySessions,
    monthSessions,
    recentPayments,
    stationUsage,
    recentActivity,
    last7DaysData,
  ] = await Promise.all([
    prisma.station.findMany({
      where: { roomId },
      select: { status: true },
    }),
    prisma.gameSession.count({
      where: {
        station: { roomId },
        status: { in: ["ACTIVE", "PAUSED"] },
      },
    }),
    prisma.payment.aggregate({
      where: {
        session: { station: { roomId } },
        createdAt: { gte: todayStart },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: {
        session: { station: { roomId } },
        createdAt: { gte: monthStart },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.gameSession.count({
      where: {
        station: { roomId },
        startTime: { gte: todayStart },
      },
    }),
    prisma.gameSession.count({
      where: {
        station: { roomId },
        startTime: { gte: monthStart },
      },
    }),
    prisma.payment.findMany({
      where: { session: { station: { roomId } } },
      include: {
        session: {
          include: { station: { select: { name: true, type: true } } },
        },
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.gameSession.groupBy({
      by: ["stationId"],
      where: {
        station: { roomId },
        startTime: { gte: monthStart },
      },
      _count: true,
      orderBy: { _count: { stationId: "desc" } },
      take: 5,
    }),
    prisma.activityLog.findMany({
      where: {
        user: {
          OR: [{ roomId }, { ownedRooms: { some: { id: roomId } } }],
        },
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    getLast7DaysRevenue(roomId),
  ]);

  const topStationIds = stationUsage.map((s) => s.stationId);
  const topStations = topStationIds.length > 0
    ? await prisma.station.findMany({
        where: { id: { in: topStationIds } },
        select: { id: true, name: true, type: true },
      })
    : [];

  const stationUsageWithNames = stationUsage.map((s) => {
    const station = topStations.find((st) => st.id === s.stationId);
    return {
      name: station?.name || "Inconnu",
      type: station?.type || "PC",
      sessions: s._count,
    };
  });

  return NextResponse.json({
    stations: {
      total: stations.length,
      free: stations.filter((s) => s.status === "FREE").length,
      occupied: stations.filter((s) => s.status === "OCCUPIED").length,
      outOfService: stations.filter((s) => s.status === "OUT_OF_SERVICE")
        .length,
    },
    activeSessions,
    revenue: {
      today: todayPayments._sum.amount || 0,
      month: monthPayments._sum.amount || 0,
    },
    sessions: {
      today: todaySessions,
      month: monthSessions,
    },
    clients: {
      today: todayPayments._count,
      month: monthPayments._count,
    },
    recentPayments,
    topStations: stationUsageWithNames,
    recentActivity,
    last7Days: last7DaysData,
  });
}

async function getLast7DaysRevenue(roomId: string) {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const nextDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - i + 1
    );

    const payments = await prisma.payment.aggregate({
      where: {
        session: { station: { roomId } },
        createdAt: { gte: date, lt: nextDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    days.push({
      date: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("fr-FR", { weekday: "short" }),
      revenue: payments._sum.amount || 0,
      sessions: payments._count,
    });
  }

  return days;
}
