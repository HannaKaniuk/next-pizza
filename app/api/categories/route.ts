import { NextRequest, NextResponse } from "next/server";

import { getCategoriesWithProducts } from "@/lib/get-categories-with-products";
import { parseProductFilterSearchParams } from "@/lib/product-filters";

export async function GET(req: NextRequest) {
  const filters = parseProductFilterSearchParams(req.nextUrl.searchParams);
  const categories = await getCategoriesWithProducts(filters);

  return NextResponse.json(categories);
}
