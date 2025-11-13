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
        const conversations = await prisma.chatConversation.findMany({
            where: {
                OR: [
                    {senderId: userId},
                    {receiverId: userId}
                ]
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        category: true,
                        condition: true,
                        images: true
                    }
                },
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
            }
        })
        return NextResponse.json({ success: true, conversations }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    
    const userId = session.user.id;

    try {
        const body = await req.json();

        const { productId, receiverId } = body;
        // check if exists
        if (!productId || !receiverId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if(receiverId==userId){
            return NextResponse.json({ error: "User cannot be both sender and reciever" }, { status: 400 });
        }
        const exisitingChatConversation = await prisma.chatConversation.findFirst({
            where: {
                productId,
                receiverId,
                senderId: userId
            }
        })
        if(exisitingChatConversation){
            return NextResponse.json({ success: true, chatInfo: exisitingChatConversation }, { status: 201 });
        }
        const chatConversation = await prisma.chatConversation.create({
            data: {
                productId,
                receiverId,
                senderId: userId
            }
        })
        return NextResponse.json({ success: true, chatInfo: chatConversation }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
