import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req: Request,{ params }: { params: Promise<{ productId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const productId = (await params)?.productId;

  try {
    const body = await req.json();

    const { name, description, price, category, condition, location } = body;

    // Ensure user owns this product
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (existingProduct.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Not your product" },
        { status: 403 }
      );
    }

    // Build update object only with provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined)
      updateData.price = parseInt(price, 10);
    if (category !== undefined) updateData.category = category;
    if (condition !== undefined) updateData.condition = condition;

    // Handle location update if provided
    if (location) {
      updateData.location = {
        update: {
          amenity: location.amenity || null,
          road: location.road || null,
          city: location.city,
          county: location.county || null,
          state_district: location.state_district || null,
          state: location.state,
          iso3166_lvl4: location["ISO3166-2-lvl4"] || null,
          postcode: location.postcode,
          country: location.country,
          country_code: location.country_code,
        },
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        images: true,
        location: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
