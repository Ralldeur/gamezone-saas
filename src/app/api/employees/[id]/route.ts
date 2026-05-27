import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const employee = await prisma.user.findFirst({
    where: { id, roomId: session.user.roomId, role: "EMPLOYEE" },
  });

  if (!employee) {
    return NextResponse.json(
      { error: "Employé non trouvé" },
      { status: 404 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      active: body.active,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      createdAt: true,
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

  const employee = await prisma.user.findFirst({
    where: { id, roomId: session.user.roomId, role: "EMPLOYEE" },
  });

  if (!employee) {
    return NextResponse.json(
      { error: "Employé non trouvé" },
      { status: 404 }
    );
  }

  await prisma.user.update({
    where: { id },
    data: { active: false },
  });

  await prisma.activityLog.create({
    data: {
      action: "EMPLOYEE_DEACTIVATED",
      description: `Employé "${employee.name}" désactivé`,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
