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
