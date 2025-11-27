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
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                products: {
                    include: {
                        images: true
                    }
                }
            }
        })
        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error) {
        console.error("Error finding product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
