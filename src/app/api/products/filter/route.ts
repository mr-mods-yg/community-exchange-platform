import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Prisma } from "@/generated/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const city = searchParams.get("city");
    const state_district = searchParams.get("state_district");
    const state = searchParams.get("state");

    const filters = [];

    if (city) filters.push({ city: { contains: city, mode: Prisma.QueryMode.insensitive } });
    if (state) filters.push({ state: { contains: state, mode: Prisma.QueryMode.insensitive } });
    if (state_district) filters.push({ state_district: { contains: state_district, mode: Prisma.QueryMode.insensitive } });

    const products = await prisma.product.findMany({
        where: {
            status: "allowed",
            location: {
                OR: filters
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            location: {
                select: {
                    city: true,
                    state: true,
                    state_district: true,
                    postcode: true
                }
            },
            images: true
        }
    });

    return NextResponse.json(products);
}
