import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log(token);

    const user = await prisma.user.findUnique({
      where: {
        verifyToken: token,
        verifyTokenExpiry: { gt: new Date() },
      } as Prisma.UserWhereUniqueInput,
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }
    console.log(user);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: undefined,
        verifyTokenExpiry: undefined,
      },
    });

    return NextResponse.json({
      message: "Email is verified successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
