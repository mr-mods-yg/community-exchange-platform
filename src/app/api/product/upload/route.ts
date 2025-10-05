import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();

    const { name, description, price, category, condition, images, location, locationCoords } = body;

    // Validate required fields
    if (!name || !description || !price || !category || !condition || !locationCoords) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!location?.city || !location?.state || !location?.country) {
      return NextResponse.json({ error: "Missing required location fields" }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadedImages: string[] = [];
    for (const img of images || []) {
      const uploadRes = await cloudinary.uploader.upload(img, {
        folder: "goods_products",
      });
      uploadedImages.push(uploadRes.secure_url);
    }

    // Create Product with LocationInfo and Images
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        category,
        condition,
        user: { connect: { id: userId } },
        locationCoords,
        location: {
          create: {
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
        },
        images: {
          create: uploadedImages.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
        location: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
