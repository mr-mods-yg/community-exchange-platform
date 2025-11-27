import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";



export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
    const session = await getServerSession(authOptions);
    const productId = (await params)?.productId;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                images: true,
                location: {
                    select: {
                        city: true,
                        state: true,
                        state_district: true,
                        postcode: true
                    }
                }
            }
        })
        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error) {
        console.error("Error finding product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const session = await getServerSession(authOptions);
  const productId = (await params).productId;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  try {
    // 1️⃣ Get all conversations for this product
    const conversations = await prisma.chatConversation.findMany({
      where: { productId }
    });

    // If any conversations exist, delete messages first
    for (const convo of conversations) {
      await prisma.message.deleteMany({
        where: { conversationId: convo.id }
      });
    }

    // 2️⃣ Delete chat conversations
    await prisma.chatConversation.deleteMany({
      where: { productId }
    });

    // 3️⃣ Delete product
    const product = await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ success: true, product }, { status: 200 });

  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}