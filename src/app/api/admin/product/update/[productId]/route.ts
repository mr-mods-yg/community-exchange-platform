import { NextResponse } from "next/server";
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


export async function POST(req: Request, { params }: { params: Promise<{ productId: string }> }) {
    const session = await getServerSession(authOptions);
    const productId = (await params)?.productId;

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
    if (!exisitingUser.isAdmin) {
        return NextResponse.json({ error: "No valid permissions" }, { status: 403 });
    }
    
    try {
        const body = await req.json();

        const { status } = body;
        // check if status exists
        if (!status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // check the status type
        if (!ALLOWED_STATUSES.includes(status as Status)) {
            return NextResponse.json(
                { error: "Invalid status value provided." },
                { status: 400 }
            );
        }
        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                status: status as Status
            }
        })
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
