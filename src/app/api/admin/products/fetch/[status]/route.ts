import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Status } from "@/generated/prisma";

const ALLOWED_STATUSES: Status[] = [
    "unreviewed",
    "allowed",
    "blocked",
    "onhold"
];


export async function GET(req: NextRequest, { params }: { params: Promise<{ status: string }> }) {
    const status = (await params)?.status;
    // console.log(status);
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (!ALLOWED_STATUSES.includes(status as Status)) {
        return NextResponse.json(
            { error: "Invalid status value provided." },
            { status: 400 }
        );
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
    if (!exisitingUser.isAdmin) {
        return NextResponse.json({ error: "No valid permissions" }, { status: 403 });
    }
    const products = await prisma.product.findMany({
        where: {
            status: status as Status
        },
        include: {
            images: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,   
                    image: true,   
                }
            },
            location: true
        }
    })
    return NextResponse.json({ success: true, products: products });
}
