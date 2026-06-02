import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function GET() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(ingredients);
}
