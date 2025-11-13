import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { pusher } from "@/lib/pusher";

export async function GET(req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
    const session = await getServerSession(authOptions);
    const conversationId = (await params)?.conversationId;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: Number(conversationId),
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return NextResponse.json({ success: true, messages }, { status: 201 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
    const session = await getServerSession(authOptions);
    const conversationId = (await params)?.conversationId;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    
    const userId = session.user.id;

    try {
        const body = await req.json();

        const { content } = body;
        // check if exists
        if (!conversationId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const message = await prisma.message.create({
            data: {
                conversationId: Number(conversationId),
                content,
                senderId: userId
            }
        })

        // trigger event in pusher
        await pusher.trigger(`conversation-${conversationId}`, "new-message", message);
        return NextResponse.json({ success: true, message }, { status: 201 });
    } catch (error) {
        console.error("Error posting message:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
