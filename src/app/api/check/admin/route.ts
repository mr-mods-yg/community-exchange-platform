import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const exisitingUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!exisitingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    return NextResponse.json({ success: true, isAdmin: exisitingUser.isAdmin });
}
