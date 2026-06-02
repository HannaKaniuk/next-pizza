import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")?.trim() ?? "";

  const products = await prisma.product.findMany({
    where: query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return NextResponse.json(products);
}
